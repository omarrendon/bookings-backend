import { Router } from "express";
import { rateLimiter } from "../utils/rateLimiting";
import {
  login,
  signUpBusiness,
  PasswordReset,
  passwordUpdated,
  refresh,
  logout,
  googleAuth,
} from "../controllers/auth.controllers";

const router = Router();

router.post("/login", rateLimiter(15 * 60 * 1000, 10), login);
router.post("/signup", signUpBusiness);
router.post("/reset-password", rateLimiter(60 * 60 * 1000, 5), PasswordReset);
router.post("/password-update", passwordUpdated);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/google", rateLimiter(15 * 60 * 1000, 10), googleAuth);

export default router;
