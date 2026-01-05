import { Request, Response, NextFunction } from "express";
import { Category } from "../../modals/category.model";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import { CommonService } from "../../services/common.services";

const categoryService = new CommonService(Category);

export class CategoryController {
  // =========================
  // CREATE CATEGORY (OWNER)
  // =========================
  static async createCategory(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { outletId, name, description, image } = req.body;

      if (!outletId || !name) {
        return res
          .status(400)
          .json(new ApiError(400, "Missing required fields"));
      }

      const category = await categoryService.create({
        outletId,
        name,
        description,
        image,
      });

      return res
        .status(201)
        .json(
          new ApiResponse(201, category, "Category created successfully")
        );
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // GET ALL CATEGORIES (PUBLIC)
  // =========================
  static async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await categoryService.getAll(req.query);
      return res
        .status(200)
        .json(
          new ApiResponse(200, result, "Categories fetched successfully")
        );
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // GET CATEGORIES BY OUTLET
  // =========================
  static async getCategoriesByOutlet(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { outletId } = req.params;

      const categories = await Category.find({
        outletId,
        status: "active",
      });

      return res
        .status(200)
        .json(
          new ApiResponse(200, categories, "Categories fetched successfully")
        );
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // UPDATE CATEGORY (OWNER)
  // =========================
  static async updateCategory(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const updatedCategory = await categoryService.updateById(id, req.body, {
        new: true,
      });

      if (!updatedCategory) {
        return res
          .status(404)
          .json(new ApiError(404, "Category not found"));
      }

      return res
        .status(200)
        .json(
          new ApiResponse(200, updatedCategory, "Category updated successfully")
        );
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // DELETE CATEGORY (OWNER)
  // =========================
  static async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const deleted = await categoryService.deleteById(id);
      if (!deleted) {
        return res
          .status(404)
          .json(new ApiError(404, "Category not found"));
      }

      return res
        .status(200)
        .json(
          new ApiResponse(200, deleted, "Category deleted successfully")
        );
    } catch (error) {
      next(error);
    }
  }
}
