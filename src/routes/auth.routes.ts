import { Router } from "express";
import { rateLimiter } from "../utils/rateLimiting";
import {
  login,
  signUpBusiness,
  PasswordReset,
  passwordUpdated,
} from "../controllers/auth.controllers";

const router = Router();

router.post("/login", rateLimiter(15 * 60 * 1000, 10), login);
router.post("/singup", signUpBusiness);
router.post("/reset-password", rateLimiter(60 * 60 * 1000, 5), PasswordReset);
router.post("/password-update", passwordUpdated);

export default router;
