import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "../../modals/payment.model";
import Order from "../../modals/order.model";
import { config } from "../../config/config";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

let razorpay: Razorpay | null = null;
if (config.payment.razorpay.keyId && config.payment.razorpay.keySecret) {
  razorpay = new Razorpay({
    key_id: config.payment.razorpay.keyId,
    key_secret: config.payment.razorpay.keySecret,
  });
}

export class PaymentController {
  /**
   * Create Razorpay order
   */
  static async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!razorpay) {
        return res.status(500).json(new ApiError(500, "Payment gateway is not configured (missing Razorpay keys)"));
      }

      const userId = (req as any).user._id;
      const { orderId } = req.body;

      if (!orderId) {
        return res.status(400).json(new ApiError(400, "orderId is required"));
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json(new ApiError(404, "Order not found"));
      }

      // Create Razorpay Order
      const options = {
        amount: order.totalAmount * 100, // Amount in paise
        currency: "INR",
        receipt: `order_rcpt_${order._id}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Save Payment Record
      const payment = await Payment.create({
        user: userId,
        order: order._id,
        razorpay_order_id: razorpayOrder.id,
        amount: options.amount,
        status: "created",
      });

      return res
        .status(201)
        .json(new ApiResponse(201, { razorpayOrder, payment }, "Razorpay order created"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify Razorpay payment signature
   */
  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json(new ApiError(400, "Missing required verification fields"));
      }

      const payment = await Payment.findOne({ razorpay_order_id });
      if (!payment) {
        return res.status(404).json(new ApiError(404, "Payment record not found"));
      }

      // Generate expected signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", config.payment.razorpay.keySecret || "")
        .update(body.toString())
        .digest("hex");

      const isValid = expectedSignature === razorpay_signature;

      if (isValid) {
        payment.status = "successful";
        payment.razorpay_payment_id = razorpay_payment_id;
        payment.razorpay_signature = razorpay_signature;
        await payment.save();

        // Update Order Payment Status
        await Order.findByIdAndUpdate(payment.order, { paymentStatus: "completed" });

        return res
          .status(200)
          .json(new ApiResponse(200, payment, "Payment verified successfully"));
      } else {
        payment.status = "failed";
        await payment.save();

        await Order.findByIdAndUpdate(payment.order, { paymentStatus: "failed" });

        return res
          .status(400)
          .json(new ApiError(400, "Invalid payment signature verification failed"));
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment details by ID
   */
  static async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id).populate("order");

      if (!payment) {
        return res.status(404).json(new ApiError(404, "Payment not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payments by user
   */
  static async getPaymentsByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // userId
      const payments = await Payment.find({ user: id }).sort({ createdAt: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, payments, "User payments fetched successfully"));
    } catch (error) {
      next(error);
    }
  }
}
