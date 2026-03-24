import { Request, Response, NextFunction } from "express";
import Bookmark from "../../modals/bookmark.model";
import { CommonService } from "../../services/common.services";
import ApiResponse from "../../utils/ApiResponse";

const bookmarkService = new CommonService(Bookmark);

export class BookmarkController {
  /**
   * Get all bookmarks with pagination
   */
  static async getAllBookmarks(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await bookmarkService.getAll(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Bookmarks fetched successfully"));
    } catch (error) {
      next(error);
    }
  }
}
