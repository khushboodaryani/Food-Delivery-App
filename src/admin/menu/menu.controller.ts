import { Request, Response, NextFunction } from "express";
import { Menu } from "../../modals/menu.model";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import { CommonService } from "../../services/common.services";

const menuService = new CommonService(Menu);

export class MenuController {
  // =========================
  // CREATE MENU (OWNER)
  // =========================
  static async createMenu(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { outletId, name } = req.body;

      if (!outletId || !name) {
        return res
          .status(400)
          .json(new ApiError(400, "Missing required fields: outletId or name"));
      }

      const menu = await menuService.create({
        outletId,
        name,
      });

      return res
        .status(201)
        .json(new ApiResponse(201, menu, "Menu created successfully"));
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // GET ALL MENUS (PUBLIC/ADMIN)
  // =========================
  static async getAllMenus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await menuService.getAll(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Menus fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // GET MENUS BY OUTLET (PUBLIC)
  // =========================
  static async getMenusByOutlet(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { outletId } = req.params;

      const menus = await Menu.find({
        outletId,
        status: "active",
      });

      return res
        .status(200)
        .json(new ApiResponse(200, menus, "Menus fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // UPDATE MENU (OWNER)
  // =========================
  static async updateMenu(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const updatedMenu = await menuService.updateById(id, req.body, {
        new: true,
      });

      if (!updatedMenu) {
        return res
          .status(404)
          .json(new ApiError(404, "Menu not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, updatedMenu, "Menu updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // DELETE MENU (OWNER)
  // =========================
  static async deleteMenu(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const deleted = await menuService.deleteById(id);
      if (!deleted) {
        return res
          .status(404)
          .json(new ApiError(404, "Menu not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, deleted, "Menu deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
