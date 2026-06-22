// Dependencies
import express from "express";
import multer from "multer";
// Middlewares
import {
  authenticateToken,
  authenticateIfPresent,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate";
// Controllers
import {
  registerReservation,
  getAllReservationsForBusiness,
  updateReservationStatusByBusiness,
  uploadProofOfPayment,
} from "../controllers/reservation.controllers";
// Models
import Reservation from "../models/reservation.model";
import Business from "../models/business.model";
// Schemas
import {
  createReservationSchema,
  updateReservationSchema,
} from "../schemas/reservation.schema";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  authenticateIfPresent,
  validateBody(createReservationSchema),
  registerReservation,
);
router.get(
  "/:business_id",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Business,
    ownerField: "owner_id",
    resourceIdParam: "business_id",
  }),
  getAllReservationsForBusiness,
);
router.post(
  "/:id/upload-proof",
  authenticateIfPresent,
  upload.single("file"),
  uploadProofOfPayment,
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
