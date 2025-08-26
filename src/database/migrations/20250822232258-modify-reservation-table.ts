"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.addColumn("reservations", "start_time", {
      type: DataTypes.TIME,
      allowNull: false, // ✅ ahora permite valores nulos
    });

    await queryInterface.addColumn("reservations", "end_time", {
      type: DataTypes.TIME,
      allowNull: false, // ✅ ahora permite valores nulos
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeColumn("reservations", "start_time");
    await queryInterface.removeColumn("reservations", "end_time");
  },
};
