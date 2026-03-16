import { Router } from "express";
import {
  createBusiness,
  deleteBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
} from "../controllers/business.controllers";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate";
import { createBusinessSchema, updateBusinessSchema } from "../schemas/business.schema";
import Business from "../models/business.model";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "owner"]),
  validateBody(createBusinessSchema),
  createBusiness,
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  deleteBusiness,
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Business,
    ownerField: "owner_id",
    resourceIdParam: "id",
  }),
  validateBody(updateBusinessSchema),
  updateBusiness,
);

router.get("/", authenticateToken, authorizeRoles(["admin"]), getAllBusinesses);
router.get("/:id", getBusinessById);

export default router;
