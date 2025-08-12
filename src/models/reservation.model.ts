// Dependencies
import { DataTypes } from "sequelize";
// Database
// import { sequelize } from "../database/sequelize";
const db = require("../database/sequelize");
const { sequelize } = db;

const Reservation = sequelize.define(
  "Reservation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reservation_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "rescheduled",
        "expired",
        "in_progress",
        "waiting",
        "declined",
        "no_show",
        "checked_in",
        "checked_out",
        "waiting_for_confirmation"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    proof_of_payment: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "reservations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Reservation;
