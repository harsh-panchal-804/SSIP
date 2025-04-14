import { Router } from "express";

import {
    createComplaint,
    getAllCompplaints,
    getUserComplaints,
    updateComplaint,
    assignDepartment
} from "../controller/complaint.controller.js"
const router= Router()


import {verifyJWT} from "../middleware/auth.middleware"
import {isAdmin} from "../middleware/adminaccess.middleware.js"



router.route("/createcomaplint").post (verifyJWT, createComplaint); // Create a new complaint
router.route("/getallcomp").get(verifyJWT, isAdmin, getAllCompplaints); // Get all complaints (Admin)
router.route("/getusercomp").get(verifyJWT, getUserComplaints); // Get complaints of the logged-in user
router.route("/:id").patch(verifyJWT, updateComplaint); // Update a complaint
router.route("/:id/assign").patch(verifyJWT, isAdmin, assignDepartment); // Assign officer to complaint

export default router;
