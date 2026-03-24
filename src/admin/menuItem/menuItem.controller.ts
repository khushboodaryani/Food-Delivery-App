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
                menuId,
                name,
                description,
                price,
                discountPercentage,
                image,
                isVeg,
                isEgg,
                isNonVeg,
                isSpicy,
                isBestSeller,
                isAvailable,
                allergens,
                customizable
            } = req.body;

            if (!menuId || !name || !price) {
                return res
                    .status(400)
                    .json(new ApiError(400, "Missing required fields: menuId, name, or price"));
            }

            // Calculate discounted price
            const discount = Number(discountPercentage) || 0;
            const discountedPrice = price - (price * (discount / 100));

            const menuItem = await menuItemService.create({
                menuId,
                name,
                description,
                price,
                discountPercentage: discount,
                discountedPrice,
                image,
                isVeg,
                isEgg,
                isNonVeg,
                isSpicy,
                isBestSeller,
                isAvailable,
                allergens: Array.isArray(allergens) ? allergens : [],
                customizable: Boolean(customizable)
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

            // 1. Find all Menus belonging to that outlet
            const MenuModel = require("../../modals/menu.model").Menu; 
            const menus = await MenuModel.find({ outletId, status: "active" }).select("_id");
            const menuIds = menus.map((m: any) => m._id);

            // 2. Find MenuItems for those menus
            const items = await MenuItem.find({ 
                menuId: { $in: menuIds }, 
                status: "active" 
            });

            return res
                .status(200)
                .json(
                    new ApiResponse(200, items, "Menu items fetched successfully")
                );
        } catch (error) {
            next(error);
        }
    }

    static async updateMenuItem(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            
            // Fetch current item to find current values for Math if not provided in updates
            const item = await MenuItem.findById(id);
            if (!item) {
                return res.status(404).json(new ApiError(404, "Menu item not found"));
            }

            let { price, discountPercentage } = req.body;
            const updatedPrice = price !== undefined ? Number(price) : item.price;
            const updatedDiscount = discountPercentage !== undefined ? Number(discountPercentage) : item.discountPercentage;

            req.body.discountedPrice = updatedPrice - (updatedPrice * (updatedDiscount / 100));

            const updatedItem = await menuItemService.updateById(id, req.body, {
                new: true,
            });
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
