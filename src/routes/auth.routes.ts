import { Router } from "express";
import { login, signup } from "../controllers/auth.controllers";

const router = Router();

router.post("/login", login);
router.post("/singup", signup);

export default router;
