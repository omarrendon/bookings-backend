import { QueryInterface, DataTypes } from "sequelize";

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.addColumn("users", "last_name", {
    type: DataTypes.STRING,
    allowNull: true,
  });
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.removeColumn("users", "last_name");
};
