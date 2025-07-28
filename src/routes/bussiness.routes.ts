import { Router } from "express";
import {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
} from "../controllers/bussiness.controllers";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/bussiness", authenticateToken, createBusiness);
router.get("/bussiness", getAllBusinesses);
router.get("/bussiness/:id", getBusinessById);

export default router;
