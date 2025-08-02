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

export default route;
