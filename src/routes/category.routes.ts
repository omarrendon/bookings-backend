// Dependencies
import { Router } from "express";
// Middlewares
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
// Controllers
import { createCategory } from "../controllers/category.controllers";

const router = Router();

router.post("/", authenticateToken, authorizeRoles("owner"), createCategory);
// router.post("/singup", signup);

export default router;
