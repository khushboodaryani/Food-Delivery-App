import { Router } from "express";
import { MenuItemController } from "./menuItem.controller";
import { asyncHandler } from "../../utils/asyncHandler";

// import { verifyOwner } from "../../middlewares/auth.middleware";

const router = Router();

// =======================
// PUBLIC ROUTES
// =======================
router.get("/", asyncHandler(MenuItemController.getAllMenuItems));
router.get(
  "/outlet/:outletId",
  asyncHandler(MenuItemController.getMenuItemsByOutlet)
);
router.get(
  "/category/:categoryId",
  asyncHandler(MenuItemController.getMenuItemsByCategory)
);

// =======================
// OWNER PROTECTED ROUTES
// =======================
router.post(
  "/create",
//   verifyOwner,
  asyncHandler(MenuItemController.createMenuItem)
);

router.put(
  "/update/:id",
//   verifyOwner,
  asyncHandler(MenuItemController.updateMenuItem)
);

router.delete(
  "/delete/:id",
//   verifyOwner,
  asyncHandler(MenuItemController.deleteMenuItem)
);

// =======================
// EXPORT
// =======================
export default router;
