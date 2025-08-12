// Dependencies
import { DataTypes } from "sequelize";
// Database
import { sequelize } from "../database/sequelize";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    gallery_images: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "businesses",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    estimated_delivery_time: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
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
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Product;
