import { Router } from "express";
import {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
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
router.get("/business", getAllBusinesses);
router.get("/business/:id", getBusinessById);

export default router;
