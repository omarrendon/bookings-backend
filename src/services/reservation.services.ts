// Dependencies
import { Op, Transaction } from "sequelize";
import { formatInTimeZone } from "date-fns-tz";
// Models
import Product from "../models/product.model";
import Reservation from "../models/reservation.model";
import ReservationProduct from "../models/reservationProduct.model";
import Business from "../models/business.model";
import Schedule from "../models/schedule.model";
import { User } from "../models/user.model";
// Database
import { sequelize } from "../database/sequelize";
// Services
import { EmailService } from "../modules/notifications/services/EmailService";
// Utils
import {
  addMinutesToDate,
  convertDateToUTC,
  convertUTCDateToLocal,
} from "../utils/dateUtils";
import { AppError } from "../utils/AppError";
import { scheduleCache } from "../utils/scheduleCache";
// Interfaces
import {
  IScheduleDay,
  IReservationProductInput,
  IReservationData,
} from "../interfaces/reservation.interface";

const TIME_ZONE = process.env.TIMEZONE || "America/Mexico_City";

// REGLAS DE NEGOCIO
/*
- Una reservación puede ser creada por cualquier usuario.
- Una reservación debe tener al menos un producto asociado.
- Una reservación debe pertenecer a un negocio.
- Una reservación puede ser actualizada por el propietario o un administrador.
- Una reservación puede ser actualizada para cambiar su estado (pendiente, confirmada,
  cancelada, completada).
- Una reservación no puede ser actualizada si ya fue completada.
*/

export const validateBusinessProducts = async (
  products: IReservationProductInput[],
  businessId: string,
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
      product?.get("id")?.toString(),
    );

    const invalidProductsIds = productIds.filter(
      id => !validProductIds.includes(id),
    );

    if (invalidProductsIds.length > 0) {
      const errorMessage = `Los siguientes ID's de los productos no pertenecen al negocio: ${invalidProductsIds.join(
        ", ",
      )}`;
      return Promise.reject(new Error(errorMessage));
    }

    return validProducts.length === products.length;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error al validar productos del negocio: ${error.message}`,
      );
    } else {
      throw new Error(
        "Error al validar productos del negocio: Error desconocido",
      );
    }
  }
};

export const createReservation = async (reservationData: IReservationData) => {
  const t = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  });

  try {
    const emailService = new EmailService();
    const { business_id, products, ...data } = reservationData;

    // Consulta única: obtener y validar productos en un solo query
    const productsFounded = await Product.findAll({
      where: {
        id: products.map(p => p.product_id),
        business_id,
      },
      transaction: t,
    });

    const foundIds = productsFounded.map(p => p.get("id")?.toString());
    const invalidIds = products
      .map(p => p.product_id)
      .filter(id => !foundIds.includes(id));

    if (invalidIds.length > 0) {
      throw new AppError(
        `Los siguientes ID's de los productos no pertenecen al negocio: ${invalidIds.join(", ")}`,
        400,
      );
    }

    if (productsFounded.length === 0) {
      throw new AppError("No se encontraron productos.", 400);
    }

    const totalDurationInMinutes = productsFounded.reduce((total, product) => {
      const duration = Math.trunc(
        product.get("estimated_delivery_time") as number,
      );
      return total + (duration || 0);
    }, 0);

    const startDate = convertDateToUTC(data.start_time);
    const endDate = addMinutesToDate(startDate, totalDurationInMinutes);

    const businessReservation = await Business.findByPk(business_id, {
      include: [
        { model: Schedule, as: "schedules" },
        { model: User, as: "user" },
      ],
      transaction: t,
    });

    if (!businessReservation) {
      throw new AppError("Negocio no encontrado.", 404);
    }

    const user = businessReservation.getDataValue("user");
    const workingHours = businessReservation.getDataValue("schedules");

    // Usar la zona horaria del negocio para determinar el día correctamente
    const dayOfWeek = formatInTimeZone(startDate, TIME_ZONE, "EEEE");

    const dayOfReservation: IScheduleDay[] =
      workingHours?.filter((day: IScheduleDay) => day.day === dayOfWeek) ?? [];

    if (dayOfReservation.length === 0) {
      throw new AppError("El negocio no opera el día seleccionado.", 400);
    }

    // Obtener hora local para comparar con los horarios del negocio
    const startLocalHour = parseInt(
      formatInTimeZone(startDate, TIME_ZONE, "H"),
      10,
    );
    const startLocalMinute = parseInt(
      formatInTimeZone(startDate, TIME_ZONE, "m"),
      10,
    );
    const endLocalHour = parseInt(
      formatInTimeZone(endDate, TIME_ZONE, "H"),
      10,
    );
    const endLocalMinute = parseInt(
      formatInTimeZone(endDate, TIME_ZONE, "m"),
      10,
    );

    const scheduleValidate = dayOfReservation.map(
      (day: IScheduleDay): boolean => {
        if (!day.open_time || !day.close_time) return false;

        const [openHour, openMinute] = day.open_time.split(":").map(Number);
        const [closeHour, closeMinute] = day.close_time.split(":").map(Number);

        const startTotal = startLocalHour * 60 + startLocalMinute;
        const endTotal = endLocalHour * 60 + endLocalMinute;
        const openTotal = openHour * 60 + openMinute;
        const closeTotal = closeHour * 60 + closeMinute;

        return startTotal >= openTotal && endTotal <= closeTotal;
      },
    );

    if (!scheduleValidate.includes(true)) {
      throw new AppError(
        "La hora de la reservación no está dentro del horario laboral del negocio.",
        400,
      );
    }

    const overLappingReservations = await Reservation.findOne({
      where: {
        business_id,
        status: { [Op.in]: ["pending", "confirmed"] },
        [Op.and]: [
          { start_time: { [Op.lt]: endDate } },
          { end_time: { [Op.gt]: startDate } },
        ],
      },
      transaction: t,
    });

    if (overLappingReservations) {
      throw new AppError("Ya existe una reserva en ese horario.", 409);
    }

    const reservation = await Reservation.create(
      {
        ...data,
        business_id,
        reservation_date: startDate,
        start_time: startDate,
        end_time: endDate,
      },
      { transaction: t },
    );

    const productEntries = products.map((prod: IReservationProductInput) => ({
      reservation_id: reservation.get("id") as string | number | undefined,
      product_id: prod.product_id,
      quantity: prod.quantity,
    }));

    const response = await ReservationProduct.bulkCreate(productEntries, {
      transaction: t,
    });

    await t.commit();

    // Convertir a hora local para la respuesta y el email (después del commit)
    reservation.setDataValue(
      "start_time",
      convertUTCDateToLocal(reservation.getDataValue("start_time")),
    );
    reservation.setDataValue(
      "end_time",
      convertUTCDateToLocal(reservation.getDataValue("end_time")),
    );

    const emailFieldsInformation = {
      toBusiness: user?.getDataValue("email"),
      to: data.customer_email,
      name: data.customer_name,
      businessName: businessReservation.getDataValue("name"),
      reservationId: reservation.getDataValue("id"),
      startTime: reservation.getDataValue("start_time"),
      endTime: reservation.getDataValue("end_time"),
      products: productsFounded,
    };

    // Invalidar cache de slots para este negocio
    scheduleCache.invalidate(`${business_id}:`);

    // Enviar emails en paralelo sin bloquear la respuesta ni afectar la transaccion
    Promise.allSettled([
      emailService.sendEmailToRegisterReservation(emailFieldsInformation),
      emailService.sendEmailToNewReservation(emailFieldsInformation),
    ]).then((results) => {
      results.forEach((result) => {
        if (result.status === "rejected") {
          console.error("[EMAIL ERROR] Error al enviar email de reservacion:", result.reason);
        }
      });
    });

    return { reservation, products: response };
  } catch (error) {
    await t.rollback();
    if (error instanceof AppError) throw error;
    if (error instanceof Error) {
      throw new Error(`Error al crear reserva: ${error.message}`);
    }
    throw new Error("Error al crear reserva: Error desconocido");
  }
};

export const getAllReservationsForBusiness = async (
  business_id?: string | string[] | undefined,
) => {
  try {
    const reservations = await Reservation.findAll({
      where: { business_id },
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
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export const updateStatus = async (
  reservationId: string,
  statusData: { status: ReservationStatus },
  user?: { userId: string; email: string; role: string },
) => {
  try {
    const emailService = new EmailService();
    const reservation = await Reservation.findByPk(reservationId, {
      include: [
        {
          model: Business,
          as: "business",
        },
      ],
    });
    const businessReservation = reservation?.getDataValue("business");
    if (!reservation) {
      throw new Error("Reservación no existente.");
    }

    if (reservation.getDataValue("status") === ReservationStatus.COMPLETED) {
      throw new Error("No se puede actualizar una reservación completada.");
    }

    const modifyStatus = {
      status: statusData.status,
      updated_by: user?.userId ?? null,
      updated_at: new Date(),
    };

    const updatedReservation = await reservation.update(modifyStatus);

    const emailBody = {
      to: reservation.getDataValue("customer_email"),
      name: reservation.getDataValue("customer_name"),
      businessName: businessReservation?.getDataValue("name"),
      startTime: reservation.getDataValue("start_time"),
      endTime: reservation.getDataValue("end_time"),
      status: statusData.status,
      products: reservation.getDataValue("products"),
    };

    if (statusData.status === ReservationStatus.CONFIRMED) {
      await emailService.sendEmailToConfirmReservation(emailBody);
    } else if (statusData.status === ReservationStatus.CANCELLED) {
      await emailService.sendEmailToCancelReservation(emailBody);
    }

    return updatedReservation;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al actualizar la reservación: ${error.message}`);
    } else {
      throw new Error("Error al actualizar la reservación: Error desconocido");
    }
  }
};
