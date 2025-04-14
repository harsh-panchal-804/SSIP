import { Router } from "express";

import { registerUser,
    loginUser,
    logout,
    NewrefreshToken,
    ChangePassword,
    updateAccountDetails,
    updatedProfilePhoto} from "../controller/User.controller"
    import {upload} from "../middleware/multer.middleware"
    import {verifyJWT} from "../middleware/auth.middleware"

    const router= Router()

    router.route("/register").post(
        upload.single("profilePhoto"),
        registerUser   )

        router.route("/login").post(loginUser)
        router.route("/logout").post(verifyJWT,logout)
        router.route("/refresh-token").post(NewrefreshToken)
        router.route("/change-password").post(verifyJWT,ChangePassword)
        router.route("/update-profile").post(verifyJWT,updateAccountDetails)
        router.route("/change-photo").post(verifyJWT, upload.single("profilePic"),updatedProfilePhoto)
        router.post("/generate-otp", verifyJWT, generateOTP);
        router.post("/verify-otp", verifyJWT, verifyOtp);

        export default router
