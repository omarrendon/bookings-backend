// Dependencies
import { Router } from "express";
// Middlewares
import { authenticateToken } from "../middlewares/auth.middleware";
// Controllers
import { createCategory } from "../controllers/category.controllers";

const router = Router();

router.post("/", authenticateToken, createCategory);

export default router;
