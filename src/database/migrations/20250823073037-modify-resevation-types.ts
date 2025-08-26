"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.sequelize.query(`
      ALTER TABLE "reservations"
      ALTER COLUMN "start_time" TYPE TIMESTAMP USING CURRENT_DATE + "start_time";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "reservations"
      ALTER COLUMN "end_time" TYPE TIMESTAMP USING CURRENT_DATE + "end_time";
    `);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.sequelize.query(`
      ALTER TABLE "reservations"
      ALTER COLUMN "start_time" TYPE TIME USING "start_time"::TIME;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "reservations"
      ALTER COLUMN "end_time" TYPE TIME USING "end_time"::TIME;
    `);
  },
};
