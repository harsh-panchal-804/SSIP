import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"



    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    
    // Upload an image
     const uploadOnCloudinary = async(localFilePath)=>{
try{
    if(!localFilePath) return null
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    })
   fs.unlinkSync(localFilePath)
   return response;

    }catch(error)  {
          fs.unlinkSync(localFilePath);
          return null;
       };  
}

const deleteFile = (publicId) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId.trim(), // is the public_id field in the resource object
        { resource_type: 'raw' }, //tell the resource type you wanna delete (image, raw, video)
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  };
 
export {uploadOnCloudinary,
    deleteFile
}
