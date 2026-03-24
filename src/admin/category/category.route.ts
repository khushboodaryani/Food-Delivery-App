import { Router } from "express";
import { CategoryController } from "./category.controller";
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
router.get("/", asyncHandler(CategoryController.getAllCategories));
router.get(
  "/outlet/:outletId",
  asyncHandler(CategoryController.getCategoriesByOutlet)
);

// =======================
// OWNER PROTECTED ROUTES
// =======================
router.post(
  "/",
  authenticateToken,
  dynamicUpload([{ name: "image", maxCount: 1 }]),
  cloudinaryUploaderMiddleware("categories"),
  asyncHandler(CategoryController.createCategory)
);

router.put(
  "/update/:id",
  authenticateToken,
  dynamicUpload([{ name: "image", maxCount: 1 }]),
  cloudinaryUploaderMiddleware("categories"),
  asyncHandler(CategoryController.updateCategory)
);

router.delete(
  "/delete/:id",
  authenticateToken,
  asyncHandler(CategoryController.deleteCategory)
);

// =======================
// EXPORT
// =======================
export default router;
