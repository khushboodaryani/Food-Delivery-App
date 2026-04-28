import { Request, Response, NextFunction } from "express";
import { MenuItem } from "../../modals/menuItem.model";
import { Outlet } from "../../modals/outlet.model";
import ApiResponse from "../../utils/ApiResponse";

export class SearchController {
  /**
   * Unified search for MenuItems and Outlets
   */
  static async unifiedSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query.q as string;

      if (!q) {
        return res.status(200).json(new ApiResponse(200, { outlets: [], menuItems: [] }, "Empty query"));
      }

      const regex = new RegExp(q, "i");

      // Search Outlets
      const outlets = await Outlet.find({
        $or: [{ name: regex }, { city: regex }],
        status: "active",
      }).limit(5);

      // Search MenuItems
      const menuItems = await MenuItem.find({
        name: regex,
        status: "active",
      }).limit(10);

      const result = {
        outlets,
        menuItems,
      };

      return res
        .status(200)
        .json(new ApiResponse(200, result, "Search results fetched successfully"));
    } catch (error) {
      next(error);
    }
  }
}
