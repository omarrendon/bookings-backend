// Dependencies
import express from "express";
import multer from "multer";
// Middlewares
import {
  authenticateToken,
  authenticateIfPresent,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import { validateBody, validateQuery } from "../middlewares/validate";
// Controllers
import {
  registerReservation,
  getAllReservationsForBusiness,
  updateReservationStatusByBusiness,
  uploadProofOfPayment,
  rescheduleReservation,
} from "../controllers/reservation.controllers";
// Models
import Reservation from "../models/reservation.model";
import Business from "../models/business.model";
// Schemas
import {
  createReservationSchema,
  updateReservationSchema,
  rescheduleReservationSchema,
  reservationFiltersSchema,
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
  validateQuery(reservationFiltersSchema),
  getAllReservationsForBusiness,
);
router.post(
  "/:id/upload-proof",
  authenticateIfPresent,
  upload.single("file"),
  uploadProofOfPayment,
);

router.patch(
  "/:id/reschedule",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Reservation,
    resourceIdParam: "id",
    through: {
      relationField: "business_id",
      relatedModel: Business,
      relatedOwnerField: "owner_id",
    },
  }),
  validateBody(rescheduleReservationSchema),
  rescheduleReservation,
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
