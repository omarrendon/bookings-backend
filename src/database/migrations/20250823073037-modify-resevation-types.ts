"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.changeColumn("reservations", "start_time", {
      type: DataTypes.DATE,
      allowNull: false, // ✅ ahora permite valores nulos
    });

    await queryInterface.changeColumn("reservations", "end_time", {
      type: DataTypes.DATE,
      allowNull: false, // ✅ ahora permite valores nulos
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.changeColumn("reservations", "start_time", {
      type: DataTypes.TIME,
      allowNull: true, // ❌ vuelve a no permitir valores nulos
    });

    await queryInterface.changeColumn("reservations", "end_time", {
      type: DataTypes.TIME,
      allowNull: false, // ❌ vuelve a no permitir valores nulos
    });
  },
};
