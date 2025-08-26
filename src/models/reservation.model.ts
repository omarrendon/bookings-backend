// Dependencies
import { DataTypes } from "sequelize";
// Database
import { sequelize } from "../database/sequelize";
// Models
import ReservationProduct from "./reservationProduct.model";
import Business from "./business.model";
import { User } from "./user.model";
import Product from "./product.model";

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
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "reservations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Reservation.belongsTo(Business, {
  foreignKey: "business_id",
  as: "business",
});

Reservation.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Reservation.belongsToMany(Product, {
  through: ReservationProduct,
  as: "products",
  foreignKey: "reservation_id",
  otherKey: "product_id",
});

Product.belongsToMany(Reservation, {
  through: ReservationProduct,
  as: "reservation_products",
  foreignKey: "product_id",
  otherKey: "reservation_id",
});
export default Reservation;
