import { Request, Response, NextFunction } from "express";
import Cart from "../../modals/cart.model";
import { MenuItem } from "../../modals/menuItem.model";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

export class CartController {
  /**
   * Add item to cart
   */
  static async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const { menuItemId, quantity = 1 } = req.body;

      if (!menuItemId) {
        return res.status(400).json(new ApiError(400, "menuItemId is required"));
      }

      // Verify item exists
      const item = await MenuItem.findById(menuItemId);
      if (!item) {
        return res.status(404).json(new ApiError(404, "Menu item not found"));
      }

      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }

      const itemIndex = cart.items.findIndex(
        (i: any) => i.menuItem.toString() === menuItemId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ menuItem: menuItemId, quantity: Number(quantity) } as any);
      }

      await cart.save();

      return res
        .status(200)
        .json(new ApiResponse(200, cart, "Item added to cart successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user cart
   */
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const cart = await Cart.findOne({ user: userId }).populate("items.menuItem");

      if (!cart) {
        return res
          .status(200)
          .json(new ApiResponse(200, { items: [], totalAmount: 0 }, "Cart is empty"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update item quantity in cart
   */
  static async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const { menuItemId, quantity } = req.body;

      if (!menuItemId || quantity === undefined) {
        return res.status(400).json(new ApiError(400, "menuItemId and quantity are required"));
      }

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json(new ApiError(404, "Cart not found"));
      }

      const itemIndex = cart.items.findIndex(
        (i: any) => i.menuItem.toString() === menuItemId
      );

      if (itemIndex === -1) {
        return res.status(404).json(new ApiError(404, "Item not found in cart"));
      }

      if (Number(quantity) <= 0) {
        cart.items.splice(itemIndex, 1); // remove if zero
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }

      await cart.save();

      return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove single item from cart
   */
  static async removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const { menuItemId } = req.body;

      if (!menuItemId) {
        return res.status(400).json(new ApiError(400, "menuItemId is required"));
      }

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res.status(404).json(new ApiError(404, "Cart not found"));
      }

      cart.items = cart.items.filter(
        (i: any) => i.menuItem.toString() !== menuItemId
      ) as any;

      await cart.save();

      return res
        .status(200)
        .json(new ApiResponse(200, cart, "Item removed from cart"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clear cart
   */
  static async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;

      let cart = await Cart.findOne({ user: userId });
      if (cart) {
        cart.items = [];
        await cart.save();
      }

      return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart cleared successfully"));
    } catch (error) {
      next(error);
    }
  }
}
