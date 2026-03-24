import { Router } from "express";
import { UserPreferenceController } from "./userpreference.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(UserPreferenceController.getAllUserPreferences));

export default router;
