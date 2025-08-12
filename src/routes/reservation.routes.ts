import express from "express";

import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import {
  registerReservation,
  getAllReservations,
} from "../controllers/reservation.controllers";

const router = express.Router();

router.post("/", registerReservation);
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "owner"),
  getAllReservations
);

export default router;
