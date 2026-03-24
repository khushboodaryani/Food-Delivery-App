import { Router } from "express";
import { BookmarkController } from "./bookmark.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(BookmarkController.getAllBookmarks));

export default router;
