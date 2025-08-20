import { Router } from "express";
import {
  createBusiness,
  deleteBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
} from "../controllers/bussiness.controllers";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import Business from "../models/business.model";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "owner"]),
  createBusiness
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  deleteBusiness
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Business,
    ownerField: "owner_id",
    resourceIdParam: "id",
  }),
  updateBusiness
);

router.get("/", authenticateToken, authorizeRoles(["admin"]), getAllBusinesses);
router.get("/:id", getBusinessById);

export default router;
