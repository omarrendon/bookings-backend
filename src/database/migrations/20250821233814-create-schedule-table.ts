"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable("schedules", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
        defaultValue: "Monday",
      },
      open_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      close_time: {
        type: DataTypes.TIME,
        allowNull: false,
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable("schedules");
  },
};
