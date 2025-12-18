import { Request, Response, NextFunction } from "express";
import { Outlet } from "../../modals/outlet.model";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import { CommonService } from "../../services/common.services";

const outletService = new CommonService(Outlet);

export class OutletController {
  // =========================
  // CREATE OUTLET (OWNER)
  // =========================
  static async createOutlet(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ownerId = req.user._id;

      const {
        name,
        description,
        address,
        coordinates,
        mobile,
        email,
        avatar,
        images,
      } = req.body;

      if (!name || !address || !coordinates?.lat || !coordinates?.lng) {
        return res
          .status(400)
          .json(new ApiError(400, "Missing required fields"));
      }

      const outlet = await outletService.create({
        ownerId,
        name,
        // description,
        address,
        coordinates,
        mobile,
        email,
        avatar,
        images,
      });

      return res
        .status(201)
        .json(new ApiResponse(201, outlet, "Outlet created successfully"));
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // GET ALL OUTLETS (PUBLIC)
  // =========================
  static async getAllOutlets(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await outletService.getAll(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Outlets fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // GET OUTLET BY ID
  // =========================
  static async getOutletById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const outlet = await outletService.getById(id);
      if (!outlet) {
        return res
          .status(404)
          .json(new ApiError(404, "Outlet not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, outlet, "Outlet fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // UPDATE OUTLET (OWNER)
  // =========================
  static async updateOutlet(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ownerId = req.user._id;
      const { id } = req.params;

      const outlet: any = await Outlet.findOne({
        _id: id,
        ownerId,
      });

      if (!outlet) {
        return res
          .status(403)
          .json(new ApiError(403, "Not authorized to update this outlet"));
      }

      const updatedOutlet = await outletService.updateById(id, req.body, {
        new: true,
      });

      return res
        .status(200)
        .json(
          new ApiResponse(200, updatedOutlet, "Outlet updated successfully")
        );
    } catch (error) {
      next(error);
    }
  }

  // =========================
  // DELETE OUTLET (OWNER)
  // =========================
  static async deleteOutlet(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ownerId = req.user._id;
      const { id } = req.params;

      const outlet: any = await Outlet.findOne({
        _id: id,
        ownerId,
      });

      if (!outlet) {
        return res
          .status(403)
          .json(new ApiError(403, "Not authorized to delete this outlet"));
      }

      const deleted = await outletService.deleteById(id);
      if (!deleted) {
        return res
          .status(404)
          .json(new ApiError(404, "Outlet not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, deleted, "Outlet deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
