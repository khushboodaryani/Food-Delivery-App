import { Router } from "express";
import { OrderController } from "./order.controller";
import { authenticateUser, authenticateToken, authorize } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// =======================
// USER ROUTES
// =======================
// Create order, view order detail, view user orders, timeline
router.post("/create", authenticateUser, asyncHandler(OrderController.createOrder));
router.get("/:id", authenticateUser, asyncHandler(OrderController.getOrderById));
router.get("/user/:userId", authenticateUser, asyncHandler(OrderController.getOrdersByUser));
router.get("/timeline/:orderId", authenticateUser, asyncHandler(OrderController.getOrderTimeline));

// =======================
// ADMIN ROUTES
// =======================
// Update order status (Admin only)
router.put(
  "/status",
  authenticateToken,
  authorize("admin"),
  asyncHandler(OrderController.updateOrderStatus)
);

export default router;
