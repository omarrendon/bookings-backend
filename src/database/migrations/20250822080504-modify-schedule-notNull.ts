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
    // Eliminar filas con nulos antes de aplicar NOT NULL para evitar violacion de constraint
    await queryInterface.sequelize.query(
      `DELETE FROM "schedules" WHERE "open_time" IS NULL OR "close_time" IS NULL`,
    );

    await queryInterface.changeColumn("schedules", "open_time", {
      type: DataTypes.TIME,
      allowNull: false,
    });

    await queryInterface.changeColumn("schedules", "close_time", {
      type: DataTypes.TIME,
      allowNull: false,
    });
  },
};
