// Dependencies
import express from "express";
// Middlewares
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate";
// Controllers
import {
  registerReservation,
  getAllReservationsForBusiness,
  updateReservationStatusByBusiness,
} from "../controllers/reservation.controllers";
// Models
import Reservation from "../models/reservation.model";
import Business from "../models/business.model";
// Schemas
import { createReservationSchema, updateReservationSchema } from "../schemas/reservation.schema";

const router = express.Router();

router.post("/", validateBody(createReservationSchema), registerReservation);
router.get(
  "/:business_id",
  authenticateToken,
  authorizeRoles(["admin", "owner"]),
  getAllReservationsForBusiness,
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Reservation, // Assuming you have a Reservation model defined
    resourceIdParam: "id",
    through: {
      relationField: "business_id", // Assuming this is the field in Product that relates to Business
      relatedModel: Business, // Assuming you have a Business model defined
      relatedOwnerField: "owner_id", // Adjust this based on your Business model's structure
    },
  }),
  validateBody(updateReservationSchema),
  updateReservationStatusByBusiness,
);

export default router;
