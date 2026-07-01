import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn("users", "google_id", {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    defaultValue: null,
  });

  await queryInterface.addColumn("users", "avatar_url", {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: null,
  });

  await queryInterface.addColumn("users", "auth_provider", {
    type: DataTypes.ENUM("local", "google"),
    allowNull: false,
    defaultValue: "local",
  });

  await queryInterface.changeColumn("users", "password", {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn("users", "google_id");
  await queryInterface.removeColumn("users", "avatar_url");
  await queryInterface.removeColumn("users", "auth_provider");

  await queryInterface.changeColumn("users", "password", {
    type: DataTypes.STRING,
    allowNull: false,
  });
}
