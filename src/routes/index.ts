import { Router } from "express";
import userRoutes from "../public/user/user.route";


const router = Router();
router.use("/user", userRoutes);


export default router;
