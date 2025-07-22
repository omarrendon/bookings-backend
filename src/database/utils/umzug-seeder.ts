import { Umzug, SequelizeStorage } from "umzug";
import { sequelize } from "../sequelize";
import path from "path";

export const seederUmzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, "../seeders/*.ts"),
    resolve: ({ name, path, context }) => {
      const seeder = require(path!);
      return {
        name,
        up: async () => seeder.up(context),
        down: async () => seeder.down(context),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    tableName: "SequelizeData", // usar tabla distinta para no chocar con migraciones
  }),
  logger: console,
});
