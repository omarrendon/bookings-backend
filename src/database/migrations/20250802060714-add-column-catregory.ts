"use strict";

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.addColumn("categories", "business_id", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "businesses",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeColumn("categories", "business_id");
  },
};
