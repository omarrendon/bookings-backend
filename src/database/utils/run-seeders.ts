import { seederUmzug } from "./umzug-seeder";

async function runSeeders() {
  try {
    const seeders = await seederUmzug.up();
    console.log(
      "✅ Seeders ejecutados:",
      seeders.map(s => s.name)
    );
  } catch (err) {
    console.error("❌ Error ejecutando seeders:", err);
    process.exit(1);
  }
}

runSeeders();
