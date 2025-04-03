import { Router } from "express";

import {
    createComplaint,
    getAllCompplaints,
    getUserComplaints,
    updateComplaint,
    assignDepartment
} from "../controller/complaint.controller.js"

import express from "express";

import {verifyJWT} from "../middleware/auth.middleware"
import {isAdmin} from "../middleware/adminaccess.middleware.js"


const router = express.Router();

router.post("/", verifyJWT, createComplaint); // Create a new complaint
router.get("/", verifyJWT, isAdmin, getAllCompplaints); // Get all complaints (Admin)
router.get("/user", verifyJWT, getUserComplaints); // Get complaints of the logged-in user
router.patch("/:id", verifyJWT, updateComplaint); // Update a complaint
router.patch("/:id/assign", verifyJWT, isAdmin, assignDepartment); // Assign officer to complaint

export default router;
