"use strict";

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Eliminar duplicados exactos conservando el registro más reciente por (business_id, date, open_time)
    await queryInterface.sequelize.query(`
      DELETE FROM schedules
      WHERE id NOT IN (
        SELECT DISTINCT ON (business_id, date, open_time) id
        FROM schedules
        ORDER BY business_id, date, open_time, id DESC
      )
    `);

    // Índice único parcial para bloques con horario: evita duplicar el mismo bloque de apertura
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX uq_schedules_business_date_open_time
      ON schedules (business_id, date, open_time)
      WHERE open_time IS NOT NULL
    `);

    // Índice único parcial para días cerrados: evita duplicar el registro "cerrado" del mismo día
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX uq_schedules_business_date_closed
      ON schedules (business_id, date)
      WHERE open_time IS NULL
    `);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.sequelize.query(
      `DROP INDEX IF EXISTS uq_schedules_business_date_open_time`
    );
    await queryInterface.sequelize.query(
      `DROP INDEX IF EXISTS uq_schedules_business_date_closed`
    );
  },
};
