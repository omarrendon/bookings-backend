"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("reservations", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      business_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "businesses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      },
      customer_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
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
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("reservations");
  },
};
