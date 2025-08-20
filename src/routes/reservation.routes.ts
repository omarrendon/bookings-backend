// Dependencies
import express from "express";
// Middlewares
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
// Controllers
import {
  registerReservation,
  getAllReservations,
  updateReservationStatus,
} from "../controllers/reservation.controllers";
import Reservation from "../models/reservation.model";
import Business from "../models/business.model";

const router = express.Router();

router.post("/", registerReservation);
router.get(
  "/:business_id",
  authenticateToken,
  authorizeRoles(["admin", "owner"]),
  getAllReservations
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
  updateReservationStatus
);

export default router;
