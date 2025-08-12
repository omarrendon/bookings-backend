import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { setupAssociations } from "./associations";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
});

// // Inicializar modelos
// Business.init(Business.getAttributes(), { sequelize });
// Reservation.init(Reservation.getAttributes(), { sequelize });
// Product.init(Product.getAttributes(), { sequelize });
// ReservationProduct.init(ReservationProduct.getAttributes(), { sequelize });
// // Role.init(Role.getAttributes(), { sequelize });
// User.init(User.getAttributes(), { sequelize });

// // Definir asociaciones
// // 1️⃣ Un negocio tiene muchas reservas
// Business.hasMany(Reservation, { foreignKey: "businessId" });
// Reservation.belongsTo(Business, { foreignKey: "businessId" });

// // 2️⃣ Relación muchos a muchos entre Reservation y Product
// Reservation.belongsToMany(Product, {
//   through: ReservationProduct,
//   foreignKey: "reservationId",
// });
// Product.belongsToMany(Reservation, {
//   through: ReservationProduct,
//   foreignKey: "productId",
// });

// // // 3️⃣ Un usuario pertenece a un rol
// // Role.hasMany(User, { foreignKey: "roleId" });
// // User.belongsTo(Role, { foreignKey: "roleId" });

// // 4️⃣ Un negocio pertenece a un usuario dueño
// User.hasMany(Business, { foreignKey: "ownerId" });
// Business.belongsTo(User, { foreignKey: "ownerId" });

// export {
//   Business,
//   Reservation,
//   Product,
//   ReservationProduct,
//   // Role,
//   User,
// };
