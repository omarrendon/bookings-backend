import { seederUmzug } from "./umzug-seeder";

async function rollbackSeeder() {
  try {
    const seeders = await seederUmzug.down({ step: 1 }); // Revierte solo el último
    console.log(
      "⏪ Seeder revertido:",
      seeders.map(s => s.name),
    );
  } catch (err) {
    console.error("❌ Error revirtiendo seeders:", err);
    process.exit(1);
  }
}

rollbackSeeder();
