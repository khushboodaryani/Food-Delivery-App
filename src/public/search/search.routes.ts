import { Router } from "express";
import { SearchController } from "./search.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// Public search
router.get("/", asyncHandler(SearchController.unifiedSearch));

export default router;
