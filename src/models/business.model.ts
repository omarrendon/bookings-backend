// DEPENDENCIES
import { DataTypes } from "sequelize";
import { sequelize } from "../database/sequelize";
// Models
import { User } from "./user.model";

const Business = sequelize.define(
  "Business",
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
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [7, 20],
      },
    },
    raiting: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    street: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    external_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    internal_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "México",
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: true, // Assuming this can be null if not set
      references: {
        model: "users", // Assuming you have a users table
        key: "id",
      },
    },
    main_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gallery_images: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    social_links: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "businesses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Business.belongsTo(User, {
  foreignKey: "owner_id",
  as: "owner",
});

export default Business;
