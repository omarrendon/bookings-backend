"use strict";

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    Promise.all([
      queryInterface.removeColumn("businesses", "password"),
      queryInterface.removeColumn("businesses", "email"),
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    Promise.all([
      queryInterface.addColumn("businesses", "password", {
        type: "VARCHAR(255)",
        allowNull: false,
      }),
      queryInterface.addColumn("businesses", "email", {
        type: "VARCHAR(255)",
        allowNull: false,
        unique: true,
      }),
    ]);
  },
};
