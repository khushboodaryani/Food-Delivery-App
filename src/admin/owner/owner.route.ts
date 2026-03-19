import { Router } from "express";
import { OwnerController } from "./owner.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { dynamicUpload, cloudinaryUploaderMiddleware } from "../../middlewares/cloudinaryUploader";


const router = Router();

// =======================
// AUTH / REGISTER
// =======================
router.post(
  "/register",
  dynamicUpload([{ name: "avatar", maxCount: 1 }]),
  cloudinaryUploaderMiddleware("owners"),
  asyncHandler(OwnerController.createOwner)
);
router.post("/login", asyncHandler(OwnerController.loginOwner));

// =======================
// OTP
// =======================
router.post("/otp/generate", asyncHandler(OwnerController.generateOtp));
// router.post("/otp/verify", asyncHandler(OwnerController.verifyOtp));

router.post("/otp/verify", asyncHandler(OwnerController.verifyOtp));
// =======================
// OWNER PROFILE / CRUD
// =======================
router.get("/", asyncHandler(OwnerController.getAllOwners));
router.post(
  "/",
  dynamicUpload([{ name: "avatar", maxCount: 1 }]),
  cloudinaryUploaderMiddleware("owners"),
  asyncHandler(OwnerController.createOwner)
);
router.get("/:id", asyncHandler(OwnerController.getOwnerById));
router.put(
  "/update/:id",
  dynamicUpload([{ name: "avatar", maxCount: 1 }]),
  cloudinaryUploaderMiddleware("owners"),
  asyncHandler(OwnerController.updateOwner)
);
router.delete("/delete", asyncHandler(OwnerController.deleteOwner));

// =======================
// EXPORT
// =======================
export default router;
