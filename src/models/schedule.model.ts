// DEPENDENCIES
import { DataTypes } from "sequelize";
// DATABASE
import { sequelize } from "../database/sequelize";
// MODELS
import Business from "./business.model";

const Schedule = sequelize.define(
  "Schedule",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    day: {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      allowNull: false,
    },
    open_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    close_time: {
      type: DataTypes.TIME,
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
  },
  {
    tableName: "schedules",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Schedule.belongsTo(Business, {
  foreignKey: "business_id",
  as: "business",
});

Business.hasMany(Schedule, {
  foreignKey: "business_id",
  as: "schedules",
});

export default Schedule;
