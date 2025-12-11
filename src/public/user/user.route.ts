import { Router } from "express";
import { UserController } from "./user.controller";
import { asyncHandler } from "../../utils/asyncHandler";

import {
  dynamicUpload,
  cloudinaryUploaderMiddleware,
} from "../../middlewares/cloudinaryUploader";

const router = Router();

/* ----------- PUBLIC ROUTES ----------- */

// Create user with avatar upload
router.post(
  "/",
  dynamicUpload([{ name: "avatar", maxCount: 1 }]),
  cloudinaryUploaderMiddleware("users"), // converts upload → string URL
  asyncHandler(UserController.createUser)
);

// Login
router.post("/login", asyncHandler(UserController.loginUser));

// Send OTP
router.post("/send-otp", asyncHandler(UserController.generateOtp));

// Verify OTP (reset password)
router.post("/verify-otp", asyncHandler(UserController.verifyOtp));

/* ----------- PROTECTED ROUTES ----------- */

// Update user with profile (avatar) upload
router.put(
  "/:id",
  dynamicUpload([{ name: "avatar", maxCount: 1 }]),
  cloudinaryUploaderMiddleware("users"), // converts upload → string URL
  asyncHandler(UserController.updateUser)
);

// Delete user
router.delete("/:id", asyncHandler(UserController.deleteUser));

export default router;
