import { Router } from "express";
import { MenuItemController } from "./menuItem.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticateToken } from "../../middlewares/authMiddleware";
import {
  dynamicUpload,
  cloudinaryUploaderMiddleware,
} from "../../middlewares/cloudinaryUploader";

const router = Router();

// =======================
// PUBLIC ROUTES
// =======================
router.get("/", asyncHandler(MenuItemController.getAllMenuItems));
router.get(
  "/outlet/:outletId",
  asyncHandler(MenuItemController.getMenuItemsByOutlet)
);

// =======================
// OWNER PROTECTED ROUTES
// =======================
router.post(
  "/",
  authenticateToken,
  dynamicUpload([{ name: "image", maxCount: 1 }]),
  cloudinaryUploaderMiddleware("menuItems"),
  asyncHandler(MenuItemController.createMenuItem)
);

router.put(
  "/update/:id",
  authenticateToken,
  dynamicUpload([{ name: "image", maxCount: 1 }]),
  cloudinaryUploaderMiddleware("menuItems"),
  asyncHandler(MenuItemController.updateMenuItem)
);

router.delete(
  "/delete/:id",
  authenticateToken,
  asyncHandler(MenuItemController.deleteMenuItem)
);

// =======================
// EXPORT
// =======================
export default router;
