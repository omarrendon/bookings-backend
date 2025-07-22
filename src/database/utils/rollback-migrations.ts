import { migrationUmzug } from "./umzug";

async function rollbackMigration() {
  try {
    const migrations = await migrationUmzug.down({ step: 1 }); // Revierte solo la última
    console.log(
      "⏪ Migración revertida:",
      migrations.map(m => m.name)
    );
  } catch (err) {
    console.error("❌ Error revirtiendo migraciones:", err);
    process.exit(1);
  }
}

rollbackMigration();
