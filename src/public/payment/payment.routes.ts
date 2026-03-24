import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authenticateUser } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// Create and Verify require user authentication
router.post("/create", authenticateUser, asyncHandler(PaymentController.createPayment));
router.post("/verify", authenticateUser, asyncHandler(PaymentController.verifyPayment));

// Get payment detail
router.get("/:id", authenticateUser, asyncHandler(PaymentController.getPaymentById));
router.get("/user/:id", authenticateUser, asyncHandler(PaymentController.getPaymentsByUser));

export default router;
