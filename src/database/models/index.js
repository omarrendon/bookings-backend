"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}
// Lectura de los modelos en el directorio actual
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Asociaciones: aquí van tus belongsTo, hasMany, belongsToMany
const { User, Role, Business, Reservation, Product, ReservationProduct } =
  sequelize.models;

// // Relaciones Usuario ↔ Roles
// Role.hasMany(User, { foreignKey: 'role_id' });
// User.belongsTo(Role, { foreignKey: 'role_id' });

// Relaciones Negocio ↔ Usuario
Business.belongsTo(User, { foreignKey: "owner_id" });
User.hasMany(Business, { foreignKey: "owner_id" });

// Relaciones Negocio ↔ Reservas
Business.hasMany(Reservation, { foreignKey: "business_id" });
Reservation.belongsTo(Business, { foreignKey: "business_id" });

// Relación M:N Reservas ↔ Productos (tabla intermedia)
Reservation.belongsToMany(Product, {
  through: ReservationProduct,
  foreignKey: "reservation_id",
  otherKey: "product_id",
  as,
});
Product.belongsToMany(Reservation, {
  through: ReservationProduct,
  foreignKey: "product_id",
  otherKey: "reservation_id",
  as: "reservations",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
