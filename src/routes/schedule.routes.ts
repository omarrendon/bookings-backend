// DEPENDENCIES
import { Router } from "express";
// CONTROLLERS
import {
  getSchedulesByBusiness,
  createSchedule,
  updateSchedule,
} from "../controllers/schedule.controllers";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate";
// SCHEMAS
import {
  createScheduleSchema,
  updateScheduleSchema,
} from "../schemas/schedule.schema";
// MODELS
import Schedule from "../models/schedule.model";
import Business from "../models/business.model";

const router = Router();

router.get("/:business_id/slots/month", getSchedulesByBusiness);

router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Business,
    ownerField: "owner_id",
    resourceIdParam: "business_id",
  }),
  validateBody(createScheduleSchema),
  createSchedule,
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Schedule,
    resourceIdParam: "id",
    through: {
      relatedOwnerField: "owner_id",
      relatedModel: Business,
      relationField: "business_id",
    },
  }),
  validateBody(updateScheduleSchema),
  updateSchedule,
);

export default router;
