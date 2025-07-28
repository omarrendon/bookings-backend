import express from "express";
import dotenv from "dotenv";

// ROUTES
import bussinessRoutes from "./routes/bussiness.routes";
import authRoutes from "./routes/auth.routes";

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
app.use("/api/bussiness", bussinessRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
