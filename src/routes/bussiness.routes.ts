import { Router } from "express";
import {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
} from "../controllers/bussiness.controllers";

const router = Router();

router.post("/", createBusiness);
router.get("/business", getAllBusinesses);
router.get("/business/:id", getBusinessById);

export default router;
