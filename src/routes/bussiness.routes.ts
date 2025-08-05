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

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "owner"),
  createBusiness
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteBusiness
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "owner"),
  updateBusiness
);
// PENDING
router.get("/", getAllBusinesses);
router.get("/business/:id", getBusinessById);

export default router;
