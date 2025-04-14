import { ApiError } from "../utils/ApiError";
import {asyncHandler} from "../utils/asyncHandler"
import jwt from "jsonwebtoken"
import {User} from "../model/Schema/user.schema"

export const verifyJWT =asyncHandler(async(req,res)=>{
 
    try{
         const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
         
         if(!token){
            throw new ApiError(401,"unauthorized access")
         }
         const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN)

         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
         if(!user){
            throw new ApiError(401,"Invalid Acess Token")
         }
         req.user=user;
         next()

        }
    catch(error){
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})
