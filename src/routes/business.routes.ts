import { Router } from "express";
import multer from "multer";
import {
  createBusiness,
  deleteBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
} from "../controllers/business.controllers";
import { uploadImage, uploadGallery } from "../controllers/upload.controllers";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate";
import { createBusinessSchema, updateBusinessSchema } from "../schemas/business.schema";
import Business from "../models/business.model";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "owner"]),
  validateBody(createBusinessSchema),
  createBusiness,
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  deleteBusiness,
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Business,
    ownerField: "owner_id",
    resourceIdParam: "id",
  }),
  validateBody(updateBusinessSchema),
  updateBusiness,
);

router.get("/", authenticateToken, authorizeRoles(["admin"]), getAllBusinesses);
router.get("/:id", getBusinessById);

router.post(
  "/upload-image",
  authenticateToken,
  upload.single("file"),
  uploadImage,
);
router.post(
  "/upload-gallery",
  authenticateToken,
  upload.array("files", 5),
  uploadGallery,
);

export default router;
