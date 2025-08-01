import express from "express";
import dotenv from "dotenv";

// ROUTES
import bussinessRoutes from "./routes/bussiness.routes";
import authRoutes from "./routes/auth.routes";
import categoriesRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ROUTE FOR TEST
app.get("/", (_req, res) => {
  res.send("API WORKING ✅");
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/business", bussinessRoutes);
app.use("/api/category", categoriesRoutes);
app.use("/api/product", productRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
