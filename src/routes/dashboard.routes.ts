import express from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import { validateQuery } from "../middlewares/validate";
import { getBusinessDashboard } from "../controllers/dashboard.controllers";
import { dashboardQuerySchema } from "../schemas/dashboard.schema";
import Business from "../models/business.model";

const router = express.Router();

router.get(
  "/:business_id",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Business,
    ownerField: "owner_id",
    resourceIdParam: "business_id",
  }),
  validateQuery(dashboardQuerySchema),
  getBusinessDashboard,
);

export default router;
