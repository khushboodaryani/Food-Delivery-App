import { Router } from "express";
import { OwnerController } from "./owner.controller";
import { asyncHandler } from "../../utils/asyncHandler";


const router = Router();

// =======================
// AUTH / REGISTER
// =======================
router.post("/register", asyncHandler(OwnerController.createOwner));
router.post("/login", asyncHandler(OwnerController.loginOwner));

// =======================
// OTP
// =======================
router.post("/otp/generate", asyncHandler(OwnerController.generateOtp));
// router.post("/otp/verify", asyncHandler(OwnerController.verifyOtp));

router.post("/otp/verify", asyncHandler(OwnerController.verifyOtp));
// =======================
// OWNER PROFILE
// =======================
// router.put("/update", asyncHandler(OwnerController.updateOwner));
router.delete("/delete", asyncHandler(OwnerController.deleteOwner));

// =======================
// EXPORT
// =======================
export default router;
