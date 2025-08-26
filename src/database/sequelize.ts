import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  timezone: process.env.DB_TIMEZONE || "00:00", // Configurar zona horaria a UTC (00:00)
  dialectOptions: {
    useUTC: true, // Para almacenar las fechas en UTC
  },
});
