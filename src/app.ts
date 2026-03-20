// DEPENDENCIES
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { rateLimiter } from "./utils/rateLimiting";
import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

// ROUTES
import businessRoutes from "./routes/business.routes";
import authRoutes from "./routes/auth.routes";
import categoriesRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import reservationRoutes from "./routes/reservation.routes";
import schedulesRoutes from "./routes/schedule.routes";
// Database
import { sequelize } from "./database/sequelize";

dotenv.config();

// VALIDACION DE VARIABLES DE ENTORNO REQUERIDAS
const REQUIRED_ENV_VARS = [
  "DB_USER",
  "DB_NAME",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "JWT_SECRET",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "CORS_ORIGIN",
];
const missingVars = REQUIRED_ENV_VARS.filter(key => !process.env[key]);
if (missingVars.length > 0) {
  console.error(
    `[STARTUP ERROR] Variables de entorno faltantes: ${missingVars.join(", ")}`,
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors({ origin: process.env.CORS_ORIGIN || false, credentials: true }));
app.use(cookieParser());
app.use(rateLimiter(15 * 60 * 1000, 100));
app.use(express.json());

// DOCS
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTE FOR TEST
app.get("/api", (_req, res) => {
  res.send("API WORKING ✅");
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/category", categoriesRoutes);
app.use("/api/product", productRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/schedule", schedulesRoutes);

// GLOBAL ERROR HANDLER
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  res
    .status(500)
    .json({ message: "Error interno del servidor.", success: false });
});

process.on("unhandledRejection", reason => {
  console.error("[UNHANDLED REJECTION]", reason);
});

process.on("uncaughtException", err => {
  console.error("[UNCAUGHT EXCEPTION]", err);
  process.exit(1);
});

// HEALTH CHECK
app.get("/api/health", async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: "ok",
    });
  } catch {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: "error",
    });
  }
});

// HEALTH CHECK DE DB ANTES DE INICIAR EL SERVIDOR
sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error(
      "[STARTUP ERROR] No se pudo conectar a la base de datos:",
      err,
    );
    process.exit(1);
  });
