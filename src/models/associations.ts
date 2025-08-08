import Product from "./product.model";
import Reservation from "./reservation.model";

export const setupAssociations = () => {
  Product.belongsToMany(Reservation, {
    through: "reservation_products",
    foreignKey: "product_id",
    otherKey: "reservation_id",
  });

  Reservation.belongsToMany(Product, {
    through: "reservation_products",
    foreignKey: "reservation_id",
    otherKey: "product_id",
  });
};
