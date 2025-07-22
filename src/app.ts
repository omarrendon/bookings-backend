import express from "express";
import dotenv from "dotenv";
// import { registerRoutes } from './interfaces/http/routes';
// import { errorHandler } from './interfaces/http/middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(express.json());
// registerRoutes(app);
// app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
