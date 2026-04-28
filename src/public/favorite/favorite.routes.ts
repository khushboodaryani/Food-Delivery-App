import { Router } from "express";
import { FavoriteController } from "./favorite.controller";
import { authenticateUser } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// =======================
// PROTECTED ROUTES
// =======================
router.use(authenticateUser);

router.post("/add", asyncHandler(FavoriteController.addFavorite));
router.get("/user/:userId", asyncHandler(FavoriteController.getFavorites));
router.delete("/remove", asyncHandler(FavoriteController.removeFavorite));

export default router;
