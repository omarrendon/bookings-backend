import Business from "../models/business.model";
import Product from "../models/product.model";
import Reservation from "../models/reservation.model";
import ReservationProduct from "../models/reservationProduct.model";
import { User } from "../models/user.model";

export function setupAssociations() {
  // Usuario ↔ Negocios
  Business.belongsTo(User, {
    foreignKey: "owner_id",
    as: "owner",
  });
  User.hasMany(Business, {
    foreignKey: "owner_id",
    as: "businesses",
  });

  // Negocio ↔ Reservas
  Reservation.belongsTo(Business, {
    foreignKey: "business_id",
    as: "business",
  });
  Business.hasMany(Reservation, {
    foreignKey: "business_id",
    as: "reservations",
  });

  // Reservas ↔ Productos (M:N)
  Reservation.belongsToMany(Product, {
    through: ReservationProduct,
    as: "products",
    foreignKey: "reservation_id",
    otherKey: "product_id",
  });
  Product.belongsToMany(Reservation, {
    through: ReservationProduct,
    as: "reservations",
    foreignKey: "product_id",
    otherKey: "reservation_id",
  });
}
