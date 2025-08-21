// Dependencies
import { Router } from "express";
// Middlewares
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware";
// Controllers
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controllers";
import Product from "../models/product.model";
import Business from "../models/business.model";

const route = Router();

route.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "owner"]),
  createProduct
);
route.get("/:id", getProducts);
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
  updateProduct
);
route.delete(
  "/:id",
  authenticateToken,
  deleteProduct,
  authorizeRoles(["admin", "owner"], {
    model: Product, // Assuming you have a Product model defined
    resourceIdParam: "id",
    through: {
      relationField: "business_id", // Assuming this is the field in Product that relates to Business
      relatedModel: Business, // Assuming you have a Business model defined
      relatedOwnerField: "owner_id", // Adjust this based on your Business model's structure
    },
  })
);

export default route;
