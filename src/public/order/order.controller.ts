import { Request, Response, NextFunction } from "express";
import Order from "../../modals/order.model";
import Cart from "../../modals/cart.model";
import { MenuItem } from "../../modals/menuItem.model";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

export class OrderController {
  /**
   * Create order from cart
   */
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const { deliveryAddress, paymentMethod = "cod" } = req.body;

      if (!deliveryAddress) {
        return res.status(400).json(new ApiError(400, "deliveryAddress is required"));
      }

      const cart = await Cart.findOne({ user: userId }).populate("items.menuItem");
      if (!cart || cart.items.length === 0) {
        return res.status(400).json(new ApiError(400, "Cart is empty"));
      }

      // Prepare order items with current prices
      const orderItems: any[] = [];
      let totalAmount = 0;

      for (const item of cart.items) {
        const menuItem = item.menuItem as any;
        const price = menuItem.discountedPrice !== undefined ? menuItem.discountedPrice : menuItem.price;
        
        orderItems.push({
          menuItem: menuItem._id,
          quantity: item.quantity,
          price: price, // Snapshotted price at order time
        });

        totalAmount += price * item.quantity;
      }

      const order = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount,
        paymentMethod,
        deliveryAddress,
        status: "pending",
        paymentStatus: paymentMethod === "cod" ? "pending" : "pending", // both pending initially
        timeline: [{ status: "pending", description: "Order placed" }],
      });

      // Clear cart after successful order creation
      cart.items = [];
      await cart.save();

      return res
        .status(201)
        .json(new ApiResponse(201, order, "Order created successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id).populate("items.menuItem");

      if (!order) {
        return res.status(404).json(new ApiError(404, "Order not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, order, "Order fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all orders for a user
   */
  static async getOrdersByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params; // or (req as any).user._id depending on endpoint structure
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

      return res
        .status(200)
        .json(new ApiResponse(200, orders, "User orders fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update order status (Admin/Owner)
   */
  static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId, status, description } = req.body;

      if (!orderId || !status) {
        return res.status(400).json(new ApiError(400, "orderId and status are required"));
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json(new ApiError(404, "Order not found"));
      }

      order.status = status;
      order.timeline?.push({
        status,
        description: description || `Order status updated to ${status}`,
        timestamp: new Date(),
      });

      await order.save();

      return res
        .status(200)
        .json(new ApiResponse(200, order, "Order status updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get order timeline
   */
  static async getOrderTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId).select("timeline");

      if (!order) {
        return res.status(404).json(new ApiError(404, "Order not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, order.timeline, "Order timeline fetched successfully"));
    } catch (error) {
      next(error);
    }
  }
}
