"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Eliminar columna day (ENUM)
    await queryInterface.removeColumn("schedules", "day");

    // En PostgreSQL el tipo ENUM queda huérfano, hay que eliminarlo manualmente
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_schedules_day";`
    );

    // Agregar columna date (DATEONLY)
    await queryInterface.addColumn("schedules", "date", {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "2026-01-01",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Eliminar columna date
    await queryInterface.removeColumn("schedules", "date");

    // Restaurar columna day como ENUM
    await queryInterface.addColumn("schedules", "day", {
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
    });
  },
};
