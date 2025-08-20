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

const router = express.Router();

router.post("/", registerReservation);
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "owner"]),
  getAllReservations
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "owner"),
  updateReservationStatus
);

export default router;
