"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.changeColumn("schedules", "open_time", {
      type: DataTypes.TIME,
      allowNull: true, // ✅ ahora permite valores nulos
    });

    await queryInterface.changeColumn("schedules", "close_time", {
      type: DataTypes.TIME,
      allowNull: true, // ✅ ahora permite valores nulos
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.changeColumn("schedules", "open_time", {
      type: DataTypes.TIME,
      allowNull: false, // ❌ vuelve a no permitir valores nulos
    });

    await queryInterface.changeColumn("schedules", "close_time", {
      type: DataTypes.TIME,
      allowNull: false, // ❌ vuelve a no permitir valores nulos
    });
  },
};
