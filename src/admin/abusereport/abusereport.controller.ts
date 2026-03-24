import { Request, Response, NextFunction } from "express";
import AbuseReport from "../../modals/abusereport.model";
import { CommonService } from "../../services/common.services";
import ApiResponse from "../../utils/ApiResponse";

const abuseReportService = new CommonService(AbuseReport);

export class AbuseReportController {
  /**
   * Get all abuse reports with pagination
   */
  static async getAllAbuseReports(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await abuseReportService.getAll(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Abuse Reports fetched successfully"));
    } catch (error) {
      next(error);
    }
  }
}
