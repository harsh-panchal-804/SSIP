import { asyncHandler } from "../utils/asyncHandler.js";
import Complaint from "../model/Schema/complaint.schema.js"
import User from "../model/Schema/user.schema.js"
import Department from "../model/Schema/department.schema.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const createComplaint = asyncHandler(async(req,res)=>{
    const {title,description,department} = req.body;

    if(!title || !description){
        throw new ApiError(400,"Title and Discription are required");
    }
    const complaint = await Complaint.create({
        user:req.user._id,
        title,
        description,
        department
    });
    res.status(201).json( new ApiResponse(201,complaint,"Complaint created successfully"));
});

const getAllCompplaints = asyncHandler(async(req,res)=>{
   const complaint = await Complaint.find().populate("user","firstName lastName email").populate("department","name");
   
   res.status(200).json(new ApiResponse(200,complaint,"All complaints retrived"));
});

const getUserComplaints= asyncHandler(async(req,res)=>{
    const complaint = await Complaint.find({user:req.user._id}).populate("department","name");
    res.status(200).json(new ApiResponse(200,complaint,"Specific User  complaints retrived"));
    
});

const updateComplaint = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const{status,remarks,title,description} = req.body;

    const complaint = await Complaint.findById(id).populate("user");
    if(!complaint){
        throw new ApiError(404,"Complaint not found");
    }
    if(complaint.user._id.toString() !== req.user._id.toString() || req.user.role !=="admin"){
        throw new ApiError(404,"You are not allowed to change the complaint");
    }

    complaint.status = status || complaint.status;
    complaint.remarks = remarks || complaint.remarks;
    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;
    
    await complaint.save();

    res.status(200).json(new ApiResponse(200,complaint,"Comaplint updated successfully"));
})

const assignDepartment = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const {Departmentname} =req.body;

    if(req.user.role !=="admin"){
        throw new ApiError(403, "You do not have permission to assign departments");
    } 
    const complaint = await Complaint.findById(id);
    if(!complaint){
        throw new ApiError(400,"Complaint not found");
    }
    const department= await Department.findOne({name:Departmentname});
    if(!department){
        throw new ApiError(400,"This department does not existing");
    }
    complaint.department=department._id;
    await complaint.save();
    res.status(200).json(new ApiResponse(200,complaint,"Comaplint assigned to department successfully"));
});

export{
    createComplaint,
    getAllCompplaints,
    getUserComplaints,
    updateComplaint,
    assignDepartment
}