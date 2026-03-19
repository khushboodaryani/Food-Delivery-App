import { Router } from "express";
import userRoutes from "../public/user/user.route";
import admin from "../admin/admin/admin.routes";
import role from "../admin/role/role.routes";
import owner from "../admin/owner/owner.route";
import outlet from "../admin/outlet/outlet.route";
import menuItem from "../admin/menuItem/menuItem.route";
// import order from "../admin/order/order.route";



const router = Router();
router.use("/user", userRoutes);
router.use("/admin", admin);
router.use("/role", role);
router.use("/owner", owner);
router.use("/outlet", outlet);
// router.use("cart",cart);
router.use("/menuItem", menuItem)

export default router;
