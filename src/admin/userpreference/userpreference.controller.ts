import { Request, Response, NextFunction } from "express";
import UserPreference from "../../modals/userpreference.model";
import { CommonService } from "../../services/common.services";
import ApiResponse from "../../utils/ApiResponse";

const userPreferenceService = new CommonService(UserPreference);

export class UserPreferenceController {
  /**
   * Get all user preferences with pagination
   */
  static async getAllUserPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      // populate 'user' if needed
      const result = await userPreferenceService.getAll(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "User Preferences fetched successfully"));
    } catch (error) {
      next(error);
    }
  }
}
