import { QueryInterface } from "sequelize";
import bcrypt from "bcrypt";

export async function up(queryInterface: QueryInterface): Promise<void> {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await queryInterface.bulkInsert("users", [
    {
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      name: "Admin User",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      email: "user@example.com",
      password: hashedPassword,
      role: "user",
      name: "Regular User",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      email: "owner@example.com",
      password: hashedPassword,
      role: "owner",
      name: "Owner User",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete("users", { email: "admin@example.com" }, {});
}
