import { Router } from "express";
import { MenuController } from "./menu.controller";
import { asyncHandler } from "../../utils/asyncHandler";
import { authenticateToken } from "../../middlewares/authMiddleware";

const router = Router();

// =======================
// PUBLIC ROUTES
// =======================
router.get("/", asyncHandler(MenuController.getAllMenus));
router.get(
  "/outlet/:outletId",
  asyncHandler(MenuController.getMenusByOutlet)
);

// =======================
// OWNER PROTECTED ROUTES
// =======================
router.post(
  "/",
  authenticateToken,
  asyncHandler(MenuController.createMenu)
);

router.put(
  "/update/:id",
  authenticateToken,
  asyncHandler(MenuController.updateMenu)
);

router.delete(
  "/delete/:id",
  authenticateToken,
  asyncHandler(MenuController.deleteMenu)
);

export default router;
