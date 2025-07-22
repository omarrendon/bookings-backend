import { QueryInterface } from "sequelize";
import bcrypt from "bcryptjs";

export async function up(queryInterface: QueryInterface): Promise<void> {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await queryInterface.bulkInsert("users", [
    {
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      name: "Admin User",
      phoneNumber: "1234567890",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete("users", { email: "admin@example.com" }, {});
}
