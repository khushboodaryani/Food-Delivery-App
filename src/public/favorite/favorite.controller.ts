import { Request, Response, NextFunction } from "express";
import Favorite from "../../modals/favorite.model";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

export class FavoriteController {
  /**
   * Add to Favorites
   */
  static async addFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const { item, itemType } = req.body;

      if (!item || !itemType) {
        return res.status(400).json(new ApiError(400, "item and itemType are required"));
      }

      if (!["MenuItem", "Outlet"].includes(itemType)) {
        return res.status(400).json(new ApiError(400, "Invalid itemType"));
      }

      const existing = await Favorite.findOne({ user: userId, item, itemType });
      if (existing) {
        return res.status(200).json(new ApiResponse(200, existing, "Already in favorites"));
      }

      const favorite = await Favorite.create({
        user: userId,
        item,
        itemType,
      });

      return res
        .status(201)
        .json(new ApiResponse(201, favorite, "Added to favorites successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get User Favorites
   */
  static async getFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const favorites = await Favorite.find({ user: userId }).populate("item");

      return res
        .status(200)
        .json(new ApiResponse(200, favorites, "Favorites fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove from Favorites
   */
  static async removeFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user._id;
      const { item } = req.body;

      if (!item) {
        return res.status(400).json(new ApiError(400, "item is required"));
      }

      const result = await Favorite.findOneAndDelete({ user: userId, item });

      if (!result) {
        return res.status(404).json(new ApiError(404, "Favorite not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, null, "Removed from favorites"));
    } catch (error) {
      next(error);
    }
  }
}
