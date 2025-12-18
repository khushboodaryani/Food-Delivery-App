import { Router } from "express";
import { OutletController } from "./outlet.controller";
import { asyncHandler } from "../../utils/asyncHandler";



const router = Router();

// =======================
// PUBLIC ROUTES
// =======================
router.get("/", asyncHandler(OutletController.getAllOutlets));
router.get("/:id", asyncHandler(OutletController.getOutletById));

// =======================
// OWNER PROTECTED ROUTES
// =======================
router.post(
  "/create",

  asyncHandler(OutletController.createOutlet)
);

router.put(
  "/update/:id",

  asyncHandler(OutletController.updateOutlet)
);

router.delete(
  "/delete/:id",
 
  asyncHandler(OutletController.deleteOutlet)
);

// =======================
// EXPORT
// =======================
export default router;
