// Dependencies
import { Router } from "express";
// Middlewares
import { authenticateToken } from "../middlewares/auth.middleware";
// Controllers
import { createProduct } from "../controllers/product.controllers";

const route = Router();

route.post("/", authenticateToken, createProduct);

export default route;
