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

const route = Router();

route.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "owner"),
  createProduct
);
route.get("/:id", getProducts);
route.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "owner"),
  updateProduct
);
route.delete(
  "/:id",
  authenticateToken,
  deleteProduct,
  authorizeRoles("admin", "owner")
);

export default route;
