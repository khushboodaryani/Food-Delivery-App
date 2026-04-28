import { Router } from "express";
import userRoutes from "../public/user/user.route";
import admin from "../admin/admin/admin.routes";
import role from "../admin/role/role.routes";
import owner from "../admin/owner/owner.route";
import outlet from "../admin/outlet/outlet.route";
import menuItem from "../admin/menuItem/menuItem.route";
// import order from "../admin/order/order.route";
import category from "../admin/category/category.route";
import menu from "../admin/menu/menu.route";
import locationRoutes from "../admin/location/location.routes";
import userPreferenceRoutes from "../admin/userpreference/userpreference.routes";
import abuseReportRoutes from "../admin/abusereport/abusereport.routes";
import bookmarkRoutes from "../admin/bookmark/bookmark.routes";
import cartRoutes from "../public/cart/cart.routes";
import orderRoutes from "../public/order/order.routes";
import paymentRoutes from "../public/payment/payment.routes";
import searchRoutes from "../public/search/search.routes";
import favoriteRoutes from "../public/favorite/favorite.routes";

const router = Router();
router.use("/user", userRoutes);
router.use("/admin", admin);
router.use("/role", role);
router.use("/owner", owner);
router.use("/outlet", outlet);
// router.use("cart",cart);
router.use("/menuItem", menuItem);
router.use("/category", category);
router.use("/menu", menu);

router.use("/location", locationRoutes);
router.use("/userpreference", userPreferenceRoutes);
router.use("/abusereport", abuseReportRoutes);
router.use("/bookmark", bookmarkRoutes);

router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes);
router.use("/search", searchRoutes);
router.use("/favorite", favoriteRoutes);

export default router;
