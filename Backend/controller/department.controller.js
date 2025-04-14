import Department from "../model/Schema/department.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import User from "../model/Schema/user.schema.js"

const CreateDepartment = asyncHandler(async(req,res)=>{
      const {name,description} = req.body;
      
      const  existing = await Department.findOne({name});
      if(existing){
        throw new ApiError (400,"Department already exists");
      }
      const department = await Department.create({name,description});
      res.status(201).json(new ApiResponse(201,department,"Department created"));

});

const assignOfficer = asyncHandler(async(req,res)=>{
    const {departmentName,userEmail} = req.body;
    const department = await Department.findOne({name : departmentName});
    if(!department){
        throw new ApiError(400,"Department does not exist");
    }
    const user = await User.findOne({email:userEmail});
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }
    if (user.role !== "officer") {
        throw new ApiError(403, "User does not have the officer role");
    }
    
   if(!department.officers.includes(user._id)){
    department.officers.push(user._id);
    await department.save();
   }
   res.status(200)
   .json(new ApiResponse(200,department,`Officer ${user.email} assigned`));
});

const deleteOfficer= asyncHandler(async(req,res)=>{
    const {departmentId,userEmail} = req.body;

    const department=await Department.findById(departmentId);
    if(!department){
        throw new ApiError(400,"Department does not exist");
    }
    const user = await User.findOne({email:userEmail});
    if(!user){
        throw new ApiError(400,"User does not exsist");
    }
    const intialLenght = department.officers.length;
    department.officers= department.officers.filter(
        (id)=> id.toString() !== user._id.toString()
    );
    if(department.officers.length === intialLenght){
        throw new ApiError(400,`${userEmail} is not an officer in this department`);
    }
    await department.save();
  res.status(200).
  json(new ApiResponse(200,department,`officer ${userEmail} removed`));

});
const getAllDepartments= asyncHandler(async(req,res)=>{
    const departments = await Department.find().populate("officers","firstName lastname role email");
    res.status(200).json(new ApiResponse(200, departments, "All departments fetched"));

})

export{
    CreateDepartment,
    assignOfficer,
    deleteOfficer,
    getAllDepartments
}