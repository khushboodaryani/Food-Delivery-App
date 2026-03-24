import { Router } from "express";
import { CartController } from "./cart.controller";
import { authenticateUser } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// All cart routes require user authentication
router.use(authenticateUser);

router.post("/add", asyncHandler(CartController.addToCart));
router.get("/", asyncHandler(CartController.getCart));
router.put("/update", asyncHandler(CartController.updateCartItem));
router.delete("/remove", asyncHandler(CartController.removeFromCart));
router.delete("/clear", asyncHandler(CartController.clearCart));

export default router;
