import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import User from "../model/Schema/user.schema"; 

export const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        throw new ApiError(403, "Admin privileges required");
    }
});

export default isAdmin;