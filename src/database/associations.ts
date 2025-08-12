import { Business } from "../models/business.model";
import Product from "../models/product.model";
import Reservation from "../models/reservation.model";
import ReservationProduct from "../models/reservationProduct.model";
import { User } from "../models/user.model";
import { sequelize } from "./sequelize";

export function setupAssociations() {
  // Business.init(Business.getAttributes(), { sequelize });
  // Reservation.init(Reservation.getAttributes(), { sequelize });
  // Product.init(Product.getAttributes(), { sequelize });
  // ReservationProduct.init(ReservationProduct.getAttributes(), { sequelize });
  // User.init(User.getAttributes(), { sequelize });

  // Asociaciones: aquí van tus belongsTo, hasMany, belongsToMany

  // Relaciones Negocio ↔ Usuario
  Business.belongsTo(User, { foreignKey: "owner_id" });
  User.hasMany(Business, { foreignKey: "owner_id" });

  // Relaciones Negocio ↔ Reservas
  Reservation.belongsTo(Business, { foreignKey: "business_id" });
  Business.hasMany(Reservation, { foreignKey: "business_id" });

  // Relación M:N Reservas ↔ Productos (tabla intermedia)
  Reservation.belongsToMany(Product, {
    through: "reservation_products",
    as: "products",
    foreignKey: "reservation_id",
    otherKey: "product_id",
  });
  Product.belongsToMany(Reservation, {
    through: "reservation_products",
    as: "reservations",
    foreignKey: "product_id",
    otherKey: "reservation_id",
  });
}
