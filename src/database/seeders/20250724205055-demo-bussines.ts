"use strict";

import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Obtener el ID del owner dinamicamente para no depender de un ID hardcodeado
    const [results] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'owner@example.com' LIMIT 1`,
    );
    const owner = (results as { id: number }[])[0];
    if (!owner) throw new Error("owner@example.com no encontrado. Corre el seeder de usuarios primero.");

    await queryInterface.bulkInsert("businesses", [
      {
        name: "Demo Business",
        description: "This is a demo business for testing purposes.",
        phone_number: "1234567890",
        email: "demo@business.com",
        website: "https://www.demobusiness.com",
        street: "Demo Street",
        external_number: "123",
        internal_number: "456",
        neighborhood: "Demo Neighborhood",
        city: "Demo City",
        state: "Demo State",
        zip_code: "12345",
        country: "Demo Country",
        social_links: JSON.stringify({
          facebook: "https://facebook.com/demobusiness",
          instagram: "https://instagram.com/demobusiness",
          whatsapp: "https://wa.me/521234567890",
        }),
        is_verified: true,
        owner_id: owner.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete("businesses", { name: "Demo Business" }, {});
  },
};
