import { Router } from "express";
import {
  CreateDepartment,
  assignOfficer,
  deleteOfficer,
  getAllDepartments
} from "../controller/department.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {isAdmin}  from "../middleware/adminaccess.middleware.js";

const router = Router();


router.post("/create", verifyJWT, isAdmin("admin"), CreateDepartment);
router.post("/assign-officer", verifyJWT, isAdmin("admin"), assignOfficer);
router.post("/remove-officer", verifyJWT, isAdmin("admin"), deleteOfficer);
router.get("/all", verifyJWT, getAllDepartments);

export default router;
