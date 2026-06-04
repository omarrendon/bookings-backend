import { Router } from "express";
import { getMe, updateMe } from "../controllers/user.controllers";
import { authenticateToken } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate";
import { updateUserSchema } from "../schemas/user.schema";

const router = Router();

router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, validateBody(updateUserSchema), updateMe);

export default router;
