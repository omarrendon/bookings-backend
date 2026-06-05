"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.addColumn("schedules", "slot_duration_minutes", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60,
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeColumn("schedules", "slot_duration_minutes");
  },
};
