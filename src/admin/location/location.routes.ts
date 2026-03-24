import { Router } from "express";
import { LocationController } from "./location.controller";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

router.get("/country", asyncHandler(LocationController.getAllCountries));
router.get("/state", asyncHandler(LocationController.getAllStates));
router.get("/city", asyncHandler(LocationController.getAllCities));

export default router;
