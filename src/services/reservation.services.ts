// Dependencies
import { Op } from "sequelize";
// Models
import Product from "../models/product.model";
import Reservation from "../models/reservation.model";
import ReservationProduct from "../models/reservationProduct.model";
// Services
import { getBusinessByUserId } from "./bussines.services";

// REGLAS DE NEGOCIO
/*
- Una reservación puede ser creada por cualquier usuario.
- Una reservación debe tener al menos un producto asociado.
- Una reservación debe pertenecer a un negocio.
- Una reservación puede ser actualizada por el propietario o un administrador.
- Una reservación puede ser actualizada para cambiar su estado (pendiente, confirmada,
  cancelada, completada).
- Una reservación no puede ser actualizada si ya fue completada.
- Solo el propietario de la reservación puede actualizar su estado.
*/

interface ReservationProductInput {
  product_id: string;
  quantity: number;
}

interface ReservationData {
  business_id: string;
  products: ReservationProductInput[];
  [key: string]: any;
}

export const validateBusinessProducts = async (
  products: ReservationProductInput[],
  businessId: string
): Promise<boolean> => {
  try {
    const productIds = products.map(p => p.product_id);
    const validProducts = await Product.findAll({
      where: {
        id: productIds,
        business_id: businessId,
      },
    });
    const validProductIds = validProducts.map(product =>
      product?.get("id")?.toString()
    );

    const invalidProductsIds = productIds.filter(
      id => !validProductIds.includes(id)
    );

    if (invalidProductsIds.length > 0) {
      const errorMessage = `Los siguientes ID's de los productos no pertenecen al negocio: ${invalidProductsIds.join(
        ", "
      )}`;
      return Promise.reject(new Error(errorMessage));
    }

    return validProducts.length === products.length;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error al validar productos del negocio: ${error.message}`
      );
    } else {
      throw new Error(
        "Error al validar productos del negocio: Error desconocido"
      );
    }
  }
};

export const createReservation = async (reservationData: ReservationData) => {
  try {
    const { business_id, products, ...data } = reservationData;
    console.log("Creating reservation SERVICE ");
    // console.log("Products = ", products);
    // console.log("Data start time 1.- = ", data.start_time);

    const productsFounded = await Product.findAll({
      where: {
        id: products.map(p => p.product_id),
        business_id,
      },
    });
    // console.log("Products found = ", productsFounded);
    if (productsFounded.length === 0)
      throw new Error("No se encontraron productos.");

    const totalDurationInMinutes = productsFounded.reduce((total, product) => {
      // console.log("Product = ", product);
      const duration = Math.trunc(
        product.get("estimated_delivery_time") as number
      );
      // console.log("Duration = ", duration);
      return total + (duration || 0);
    }, 0);
    console.log("Total duration in minutes = ", totalDurationInMinutes);
    // console.log("Data start time 2.- = ", data.start_time);

    const startDate = new Date(data.start_time);
    console.log("Start date = ", startDate);
    const endDate = new Date(
      startDate.getTime() + totalDurationInMinutes * 60000
    );
    console.log("End date = ", endDate);

    const overLappingReservations = await Reservation.findOne({
      where: {
        business_id,
        status: ["pending", "confirmed"],
        [Op.or]: [
          {
            start_time: {
              [Op.lt]: endDate,
            },
          },
          {
            end_time: {
              [Op.gt]: startDate,
            },
          },
        ],
      },
    });

    if (overLappingReservations)
      throw new Error("Ya existe una reserva en ese horario.");

    console.log("Overlapping reservations = ", overLappingReservations);

    const reservation = await Reservation.create({
      ...data,
      business_id,
      start_time: startDate,
      end_time: endDate,
    });

    console.log("Created reservation === ", reservation);
    if (!reservation) throw new Error("No se pudo crear la reservación.");

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
    console.log("Created reservation X products = ", response);

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
    let where: any = {};

    if (role === "owner") {
      const businessObj = await getBusinessByUserId(userId);
      if (!businessObj || !businessObj.business)
        throw new Error("No se encontró el negocio del propietario.");
      where.business_id = businessObj.business?.get("id");
    }
    if (role === "admin" && business_id) {
      where.business_id = business_id;
    }

    const reservations = await Reservation.findAll({
      where,
      include: [
        {
          model: Product,
          as: "products",
          through: {
            attributes: ["quantity"],
          },
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return reservations;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener reservas: ${error.message}`);
    } else {
      throw new Error("Error al obtener reservas: Error desconocido");
    }
  }
};

enum ReservationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELED = "canceled",
  COMPLETED = "completed",
}

export const updateStatus = async (
  reservationId: string,
  statusData: { status: ReservationStatus },
  user?: any
) => {
  try {
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      throw new Error("Reservación no existente.");
    }

    if (reservation.getDataValue("status") === ReservationStatus.COMPLETED) {
      throw new Error("No se puede actualizar una reservación completada.");
    }

    const modifyStatus = {
      status: statusData.status,
      updated_by: JSON.stringify(user),
      updated_at: new Date(),
    };

    const updatedReservation = await reservation.update(modifyStatus, {
      where: {
        id: reservationId,
      },
    });

    return updatedReservation;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al actualizar la reservación: ${error.message}`);
    } else {
      throw new Error("Error al actualizar la reservación: Error desconocido");
    }
  }
};
