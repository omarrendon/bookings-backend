import Reservation from "../models/reservation.model";
import ReservationProduct from "../models/reservationProduct.model";

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
