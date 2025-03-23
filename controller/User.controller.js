import User from "../model/Schema/user.schema.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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