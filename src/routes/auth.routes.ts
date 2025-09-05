import { Router } from "express";
import {
  login,
  signUpBusiness,
  PasswordReset,
  passwordUpdated,
} from "../controllers/auth.controllers";

const router = Router();

router.post("/login", login);
router.post("/signup", signUpBusiness);
router.post("/reset-password", PasswordReset);
router.post("/password-update", passwordUpdated);

export default router;
