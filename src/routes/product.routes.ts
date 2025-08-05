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

route.post("/", authenticateToken, createProduct);
route.get("/", getProducts);
route.delete(
  "/:id",
  authenticateToken,
  deleteProduct,
  authorizeRoles("admin", "owner")
);
route.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "owner"),
  updateProduct
);

export default route;
