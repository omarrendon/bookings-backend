import { DataTypes } from "sequelize";
import { sequelize } from "../database/sequelize";

const ReservationProduct = sequelize.define(
  "ReservationProduct",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "reservations",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "reservation_products",
    timestamps: true,
  }
);

export default ReservationProduct;
