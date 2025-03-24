import User from "../Backend/model/Schema/user.schema.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken= async(userId)=>{
    try{
  const user = await User.findById(userId)
  const acessToken= user.generateAccessToken()
  const refreshToken= user.genrateRefreshToken()
  user.refreshToken= refreshToken
  await user.save({validateBeforeSave:false})
  return{acessToken,refreshToken}
    } catch(error){
      throw new ApiError(500,"Something went wrong while generating access and refresh token")
    }
}

const registerUser= asyncHandler(async(req,res)=>{
    const{firstName,lastName,email,password,role} =req.body;

    // if(!firstName || !lastName || !email || !password){
    //     throw new ApiError(400,"All fields required")
    // }
    if(
        [firstName,lastName,email,password,role].some((field)=>field.trim() ==="")){
            throw new ApiError(400,"All fields required")
        }
 
       const exsistedUser = await User.findOne({
        $or:[{username},{email}]
       })
       if(exsistedUser){
        throw new ApiError(409,"User already existed")
       }
       const profilePictureLocalPath = req.file?.profilePicture[0]?.path;

       if(!profilePictureLocalPath){
        throw new ApiError(400,"Avatar file is required")
       }
       const profilePicture = await uploadOnCloudinary(profilePictureLocalPath)

       if(!profilePicture){
        throw new ApiError(400,"Avatar file is required")
       }

       const user= await User.create({
        firstName,
        lastName,
        profilePicture:profilePicture.url,
        email,
        role,
        password
       })
       const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" 
       )
 
       if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
       }

       return res.status(201).json(
        new ApiResponse(200,createdUser,"User registerd sucessfully")
       )
    })

    const loginUser= asyncHandler(async(req,res)=>{
        const{firstName,email,password} = req.body;

        if(
            [firstName,email,password].some((filter)=>filter?.trim()=== "") ){
                throw new ApiError(400,"FiratNmae,email,Password required") 
            }

            const user = await User.findOne({
                $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(401,"User does not exist")
    }
    const isPaswordValid = await user.isPasswordCorrect(password)
    if(!isPaswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }
    
const{acessToken,refreshToken}= await generateAccessAndRefreshToken(user._id)
    
const loggerUser= await User.findById(user._id).select("-password -refreshToken")

const options={
    httpOnly:true,
    secure:true
}

return res
.status(200)
.cookie("accessToken",acessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(
        200,
        {
            user:loggerUser,acessToken,refreshToken
        },
        "User logged in Successfully"
    )
)
})
const logout= asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.User._id={
            $unset:{
                refreshToken:1
            }
        },{
            new:true
        }
    )
    const option ={
        httpOnly:true,
        secure:true
    }
    return res.
    status(200)
    .clearCokkie("accessToken",option)
    .clearCokkie("refreshToken",option)
    .json(new ApiResponse(200,{},"User logged out"))

})
const NewrefreshToken = asyncHandler(async(req,res)=>{
    const incomingrefresh= req.cokkies.refreshToken;

    if(!incomingrefresh){
        throw new ApiError(400,"refreshToken not found")
    }
    try{
        const decodeToken=jwt.verify(incomingrefresh,
            process.en.REFRESH_TOKEN
        )
        const user= await User.findById(decodeToken?._id);

        if(!user){
             throw new ApiError(400,"user do not exist")
        }
        if(incomingrefresh !== user?.refreshToken){
          throw new ApiError(409,"Refresh token not found")
        }
        const{acessToken,newrefreshToken}= await generateAccessAndRefreshToken(user._id)
        const options={
            httpOnly:true,
            secure:true
        }
        return res
        .status(200)
        .cookie("accessToken",acessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                acessToken,refreshToken:newrefreshToken
                },
                "User logged in Successfully"
            )
        )
    }catch(error){
       throw new ApiError(401,error?.message ||"refresh token not found")

    }


})



    export{
        registerUser,
        loginUser,
        logout,
        NewrefreshToken
    }