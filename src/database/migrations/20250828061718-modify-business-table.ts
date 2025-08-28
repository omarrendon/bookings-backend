"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeColumn("businesses", "hours_of_operation");
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.addColumn("businesses", "hours_of_operation", {
      type: DataTypes.JSONB,
      allowNull: true,
    });
  },
};
