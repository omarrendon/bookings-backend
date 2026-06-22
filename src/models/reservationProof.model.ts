import { DataTypes } from "sequelize";
import { sequelize } from "../database/sequelize";

const ReservationProof = sequelize.define(
  "ReservationProof",
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
      onDelete: "CASCADE",
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    public_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "reservation_proofs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default ReservationProof;
