import { sequelize } from "../sequelize";
import { migrationUmzug } from "./umzug";

async function resetDatabase() {
  try {
    console.log("🧹 Limpiando historial de seeders (SequelizeData)...");
    try {
      await sequelize.query('DELETE FROM "SequelizeData"');
      console.log("   Historial de seeders limpiado.");
    } catch {
      console.log("   Tabla SequelizeData no existe aun, se creara al correr los seeders.");
    }

    console.log("\n⏬ Revirtiendo todas las migraciones...");
    const reverted = await migrationUmzug.down({ to: 0 });
    if (reverted.length === 0) {
      console.log("   No habia migraciones aplicadas.");
    } else {
      console.log("   Revertidas:", reverted.map(m => m.name));
    }

    console.log("\n⏫ Aplicando todas las migraciones...");
    const applied = await migrationUmzug.up();
    if (applied.length === 0) {
      console.log("   No habia migraciones pendientes.");
    } else {
      console.log("   Aplicadas:", applied.map(m => m.name));
    }

    console.log("\n✅ Base de datos reseteada exitosamente.");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Error al resetear la base de datos:", err);
    process.exit(1);
  }
}

resetDatabase();
