"use strict";

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert("businesses", [
      {
        name: "Demo Business",
        description: "This is a demo business for testing purposes.",
        // address: "123 Demo St, Demo City, DC 12345",
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
        hours_of_operation: JSON.stringify({
          monday: "9:00 AM - 5:00 PM",
          tuesday: "9:00 AM - 5:00 PM",
          wednesday: "9:00 AM - 5:00 PM",
          thursday: "9:00 AM - 5:00 PM",
          friday: "9:00 AM - 5:00 PM",
          saturday: "10:00 AM - 4:00 PM",
          sunday: "Closed",
        }),
        owner_id: 3, // Assuming the owner with ID 3 exists
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {},
};
