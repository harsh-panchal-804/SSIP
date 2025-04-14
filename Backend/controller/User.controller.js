import User from "../Backend/model/Schema/user.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import speakeasy from "speakeasy";
import { deleteFile, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  if ([firstName, lastName, email, password, role].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }]
  });

  if (existedUser) {
    throw new ApiError(409, "User already existed");
  }

  const profilePictureLocalPath = req.file?.profilePicture[0]?.path;

  if (!profilePictureLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

  if (!profilePicture) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    firstName,
    lastName,
    profilePicture: profilePicture.url,
    email,
    role,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { firstName, email, password, role } = req.body;

  if ([firstName, email, password, role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "First name, email, password, and role are required");
  }

  const user = await User.findOne({
    $or: [{ email }]
  });

  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const NewrefreshToken = asyncHandler(async (req, res) => {
  const incomingRefresh = req.cookies.refreshToken;

  if (!incomingRefresh) {
    throw new ApiError(400, "Refresh token not found");
  }

  try {
    const decodedToken = jwt.verify(incomingRefresh, process.env.REFRESH_TOKEN);
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(400, "User does not exist");
    }

    if (incomingRefresh !== user?.refreshToken) {
      throw new ApiError(409, "Refresh token mismatch");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Refresh token invalid");
  }
});

const generateOTP = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  const now =Date.now();
  const MAX_WINDOW= 5*60*1000;
  const Max_Request=3;

  const recentRequest = user.otpRequest.filter(
            (ts)=>now - new Date(ts).getTime() <MAX_WINDOW
  );

  if(recentRequest.length >= Max_Request){
    throw new ApiError(409,"Too many OTP Requests.Please wait");
  }

  const otp = speakeasy.totp({
    secret: process.env.OTP_SECRET,
    encoding: "base32",
  });

  const otpExpiry = Date.now() + parseInt(process.env.OTP_EXPIRY_DURATION);

  recentRequest.push(new Date().toISOString());
  
  user.twoFactorToken = otp;
  user.otpExpiry = otpExpiry;
  user.otpRequests= recentRequest;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, { otp }, "OTP generated successfully"));
});

const verifyOtp = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }

  const { otp } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.twoFactorToken || !user.otpExpiry) {
    throw new ApiError(400, "OTP not generated");
  }

  if (Date.now() > user.otpExpiry) {
    user.twoFactorToken = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(400, "OTP expired");
  }

  const verifiedOtp = speakeasy.totp.verify({
    secret: process.env.OTP_SECRET,
    encoding: "base32",
    token: otp,
  });

  if (!verifiedOtp) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.twoFactorToken = undefined;
  user.otpExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "OTP verified successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPassCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPassCorrect) {
    throw new ApiError(400, "Invalid password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        firstName,
        lastName,
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Account details updated"));
});

const updateProfilePhoto = asyncHandler(async (req, res) => {
  const profilePictureLocalPath = req.file?.path;

  if (!profilePictureLocalPath) {
    throw new ApiError(400, "Avatar file missing");
  }

  const user = await User.findById(req.user._id);

  if (user?.profilePicture?.public_id) {
    await deleteFile(user.profilePicture.public_id);
  }

  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

  if (!profilePicture) {
    throw new ApiError(400, "Failed to upload new photo");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profilePicture: profilePicture.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, updatedUser, "Profile photo updated"));
});

export {
  registerUser,
  generateOTP,
  verifyOtp,
  loginUser,
  logout,
  NewrefreshToken,
  changePassword,
  updateAccountDetails,
  updateProfilePhoto,
};
