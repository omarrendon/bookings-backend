import { Router } from "express";
import { login, signUpBusiness } from "../controllers/auth.controllers";

const router = Router();

router.post("/login", login);
router.post("/signup", signUpBusiness);

export default router;
