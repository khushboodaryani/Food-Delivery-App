import { Router } from "express";
import { OutletController } from "./outlet.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  dynamicUpload,
  cloudinaryUploaderMiddleware,
} from "../../middlewares/cloudinaryUploader";
import { authenticateToken } from "../../middlewares/authMiddleware";

const router = Router();

// =======================
// PUBLIC ROUTES
// =======================
router.get("/", asyncHandler(OutletController.getAllOutlets));
router.get("/:id", asyncHandler(OutletController.getOutletById));

// =======================
// OWNER PROTECTED ROUTES
// =======================
router.post(
  "/",
  authenticateToken,                          // sets req.user
  dynamicUpload([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  cloudinaryUploaderMiddleware("outlets"),
  asyncHandler(OutletController.createOutlet)
);

router.put(
  "/update/:id",
  authenticateToken,                          // sets req.user
  dynamicUpload([
    { name: "avatar", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  cloudinaryUploaderMiddleware("outlets"),
  asyncHandler(OutletController.updateOutlet)
);

router.delete(
  "/delete/:id",
  authenticateToken,                          // sets req.user
  asyncHandler(OutletController.deleteOutlet)
);

// =======================
// EXPORT
// =======================
export default router;
