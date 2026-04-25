// Dependencies
import { Router } from "express";
import multer from "multer";
// Middlewares
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/validate";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema";
// Controllers
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controllers";
import {
  uploadImage,
  uploadGallery,
  deleteImage,
  getImages,
} from "../controllers/product-image.controllers";
import Product from "../models/product.model";
import Business from "../models/business.model";

const route = Router();
const upload = multer({ storage: multer.memoryStorage() });

route.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Business,
    ownerField: "owner_id",
    resourceIdParam: "business_id",
  }),
  validateBody(createProductSchema),
  createProduct,
);
route.get("/:businessId", getProducts);
route.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Product, // Assuming you have a Product model defined
    resourceIdParam: "id",
    through: {
      relationField: "business_id", // Assuming this is the field in Product that relates to Business
      relatedModel: Business, // Assuming you have a Business model defined
      relatedOwnerField: "owner_id", // Adjust this based on your Business model's structure
    },
  }),
  validateBody(updateProductSchema),
  updateProduct,
);
route.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "owner"], {
    model: Product,
    resourceIdParam: "id",
    through: {
      relationField: "business_id",
      relatedModel: Business,
      relatedOwnerField: "owner_id",
    },
  }),
  deleteProduct,
);

// Product images (rutas estáticas antes que las dinámicas para evitar conflictos)
route.delete("/images/:imageId", authenticateToken, deleteImage);
route.get("/:productId/images", getImages);
route.post("/:productId/upload-image", authenticateToken, upload.single("file"), uploadImage);
route.post("/:productId/upload-gallery", authenticateToken, upload.array("files", 5), uploadGallery);

export default route;
