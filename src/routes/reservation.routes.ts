import express from "express";

import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import { registerReservation } from "../controllers/reservation.controllers";

const router = express.Router();

router.post(
  "/",
  // authenticateToken,
  // authorizeRoles("admin", "user", "owner"),
  registerReservation
);

export default router;
