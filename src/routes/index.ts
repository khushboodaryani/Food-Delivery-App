import { Router } from "express";
import userRoutes from "../public/user/user.route";
import admin from "../admin/admin/admin.routes";
import role from "../admin/role/role.routes";


const router = Router();
router.use("/user", userRoutes);
router.use("/admin",admin);
router.use("/role",role);


export default router;
