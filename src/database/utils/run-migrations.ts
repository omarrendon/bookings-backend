import { migrationUmzug } from "./umzug";

async function runMigrations() {
  try {
    const migrations = await migrationUmzug.up();
    console.log(
      "✅ Migraciones ejecutadas:",
      migrations.map(m => m.name)
    );
  } catch (err) {
    console.error("❌ Error ejecutando migraciones:", err);
    process.exit(1);
  }
}

runMigrations();
