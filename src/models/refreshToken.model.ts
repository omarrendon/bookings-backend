// Dependencies
import { DataTypes } from "sequelize";
// Database
import { sequelize } from "../database/sequelize";
// Models
import { User } from "./user.model";

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "refresh_tokens",
    timestamps: true,
    underscored: true,
  },
);

RefreshToken.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default RefreshToken;
