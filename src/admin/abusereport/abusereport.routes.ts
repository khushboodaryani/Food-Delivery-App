import { Router } from "express";
import { AbuseReportController } from "./abusereport.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(AbuseReportController.getAllAbuseReports));

export default router;
