import { Request, Response, NextFunction } from 'express';
import { MenuItem } from '../../modals/menuItem.model';
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import { CommonService } from '../../services/common.services';

const menuItemService = new CommonService(MenuItem);

export class MenuItemController {
    static async createMenuItem(req: Request, res: Response, next: NextFunction) {
        try {
            const ownerId = (req as any).user._id;

            const {
                outletId,
                categoryId,
                name,
                description,
                price,
                image,
                isVeg,
                isAvailable
            } = req.body;

            if (!outletId || !categoryId || !name || !price) {
                return res
                    .status(400)
                    .json(new ApiError(400, "Missing required fields"));
            }

            const menuItem = await menuItemService.create({
                outletId,
                categoryId,
                name,
                description,
                price,
                image,
                isVeg,
                isAvailable,
            });

            return res
                .status(201)
                .json(
                    new ApiResponse(201, menuItem, "Menu item created successfully")
                );

        } catch (err) {
            next(err);
        }
    }

    static async getAllMenuItems(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const result = await menuItemService.getAll(req.query)
            return res
                .status(200)
                .json(new ApiResponse(200, result, "Menu items fetched successfully"));

        } catch (err) {
            next(err);
        }
    }

    static async getMenuItemsByOutlet(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { outletId } = req.params;

            const items = await MenuItem.find({ outletId, status: "active" });

            return res
                .status(200)
                .json(
                    new ApiResponse(200, items, "Menu items fetched successfully")
                );
        } catch (error) {
            next(error);
        }
    }
    static async getMenuItemsByCategory(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { categoryId } = req.params;

            const items = await MenuItem.find({
                categoryId,
                status: "active"
            });
            return res.status(200)
                .json(
                    new ApiResponse(200, items, "Menu items fetched successfully")
                );
        } catch (err) {
            next(err);
        }
    }

    static async updateMenuItem(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const updatedItem = await menuItemService.updateById(id, req.body, {
                new: true,
            });

            if (!updatedItem) {
                return res
                    .status(404)
                    .json(new ApiError(404, "Menu item not found"))
            }
            return res.status(200).json(
                new ApiResponse(200, updatedItem, "Menu item updated successfully")
            );
        } catch (err) {
            next(err);
        }
    }

    static async deleteMenuItem(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const deleted = await menuItemService.deleteById(id);
            if (!deleted) {
                return res
                    .status(404)
                    .json(new ApiError(404, "Menu item not found"));
            }
            return res
                .status(200)
                .json(
                    new ApiResponse(200, deleted, "Menu item deleted successfully")
                );
        } catch (err) {
            next(err);
        }
    }

}
