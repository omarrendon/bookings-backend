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
// MODELS
import Schedule from "../models/schedule.model";
import Business from "../models/business.model";

const router = Router();

router.get("/:business_id/slots/month", getSchedulesByBusiness);
router.post(
  "/",
  authenticateToken,
  authorizeRoles(
    ["admin", "owner"]
    // , {
    // model: Schedule,
    // resourceIdParam: "id",
    // through: {
    //   relatedOwnerField: "business_id",
    //   relatedModel: Business,
    //   relationField: "owner_id",
    // },}
  ),
  createSchedule
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "owner"]),
  updateSchedule
);

export default router;
