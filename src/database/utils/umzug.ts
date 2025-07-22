import { Umzug, SequelizeStorage } from "umzug";
import { sequelize } from "../sequelize"; // Tu instancia de Sequelize
import path from "path";

export const migrationUmzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, "../migrations/*.ts"),
    resolve: ({ name, path, context }) => {
      const migration = require(path!);
      return {
        name,
        up: async () => migration.up(context),
        down: async () => migration.down(context),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});
