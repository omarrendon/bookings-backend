// Models
import { Business } from "../models/business.model";
import Product from "../models/product.model";
import Reservation from "../models/reservation.model";
import ReservationProduct from "../models/reservationProduct.model";

// Services
import { getBusinessByUserId } from "./bussines.services";

interface ReservationProductInput {
  product_id: string;
  quantity: number;
}

interface ReservationData {
  business_id: string;
  products: ReservationProductInput[];
  [key: string]: any;
}

export const createReservation = async (
  reservationData: ReservationData,
  userId: string | undefined
) => {
  try {
    const { business_id, products, ...data } = reservationData;
    console.log("Creating reservation with data:", {
      ...data,
      business_id,
      user_id: userId,
    });

    const reservation = await Reservation.create({
      ...data,
      business_id,
    });
    console.log("Reservation created: ", reservation);

    const productEntries: {
      reservation_id: string | number | undefined;
      product_id: string;
      quantity: number;
    }[] = products.map((prod: ReservationProductInput) => ({
      reservation_id: reservation.get("id") as string | number | undefined,
      product_id: prod.product_id,
      quantity: prod.quantity,
    }));

    const response = await ReservationProduct.bulkCreate(productEntries);
    console.log("Reservation products created: ", response);

    return { reservation, products: response };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al crear reserva: ${error.message}`);
    } else {
      throw new Error("Error al crear reserva: Error desconocido");
    }
  }
};

export const getAllReservations = async (
  userId: string | undefined,
  role: string | undefined,
  business_id?: string | string[] | undefined
) => {
  try {
    console.log("Init getAllReservations services ---", userId);
    const where: any = {};
    console.log("INIT WHERE : ", where);
    if (role === "owner") {
      console.log("Filtering by owner: ", userId);
      // const businessId = await getBusinessByUserId(userId);
      // console.log("Business ID for owner: ", businessId);
      // if (!businessId)
      // throw new Error("No se encontró el negocio del propietario.");
      // where.business_id = businessId?.get("id");
    }
    if (role === "admin" && business_id) {
      console.log("Filtering by business_id for admin: ", business_id);
      where.business_id = business_id;
    }

    console.log("Where clause for reservations: ", where);

    const reservations = await Reservation.findAll({
      // where,
      include: [
        //   {
        //     model: Business,
        //     as: "products",
        //     // through: { Product },
        //     attributes: ["id", "name", "address"],
        //   },
        {
          model: ReservationProduct,
          include: [{ model: Product, attributes: ["id", "name", "price"] }],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    console.log("Reservations found: ", reservations);
    return reservations;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener reservas: ${error.message}`);
    } else {
      throw new Error("Error al obtener reservas: Error desconocido");
    }
  }
};
