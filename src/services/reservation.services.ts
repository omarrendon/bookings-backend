// Dependencies
import { Op, Transaction } from "sequelize";
import { formatInTimeZone } from "date-fns-tz";
// Models
import Product from "../models/product.model";
import Reservation from "../models/reservation.model";
import ReservationProduct from "../models/reservationProduct.model";
import ReservationProof from "../models/reservationProof.model";
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
  IReservationProductInput,
  IReservationData,
} from "../interfaces/reservation.interface";

const TIME_ZONE = process.env.TIMEZONE || "America/Mexico_City";

const buildBusinessContact = (business: any) => {
  const street = business.getDataValue("street") ?? "";
  const extNum = business.getDataValue("external_number") ?? "";
  const intNum = business.getDataValue("internal_number");
  const neighborhood = business.getDataValue("neighborhood");
  const city = business.getDataValue("city") ?? "";
  const state = business.getDataValue("state") ?? "";
  const zip = business.getDataValue("zip_code") ?? "";
  const country = business.getDataValue("country") ?? "";

  const addressParts = [
    `${street} #${extNum}${intNum ? ` Int. ${intNum}` : ""}`,
    neighborhood,
    `${city}, ${state} ${zip}`,
    country,
  ].filter(Boolean);
  const address = addressParts.join(", ");

  return {
    phone: business.getDataValue("phone_number") ?? undefined,
    address,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    website: business.getDataValue("website") ?? undefined,
    socialLinks: business.getDataValue("social_links") ?? undefined,
  };
};

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

    // Obtener la fecha local de la reservación para buscar el schedule del día exacto
    const dateStr = formatInTimeZone(startDate, TIME_ZONE, "yyyy-MM-dd");

    const dayOfReservation =
      workingHours?.filter((s: any) => s.getDataValue("date") === dateStr) ??
      [];

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

    const scheduleValidate = dayOfReservation.map((s: any): boolean => {
      const openTime: string = s.getDataValue("open_time");
      const closeTime: string = s.getDataValue("close_time");
      if (!openTime || !closeTime) return false;

      const [openHour, openMinute] = openTime.split(":").map(Number);
      const [closeHour, closeMinute] = closeTime.split(":").map(Number);

      const startTotal = startLocalHour * 60 + startLocalMinute;
      const endTotal = endLocalHour * 60 + endLocalMinute;
      const openTotal = openHour * 60 + openMinute;
      const closeTotal = closeHour * 60 + closeMinute;

      return startTotal >= openTotal && endTotal <= closeTotal;
    });

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
      businessContact: buildBusinessContact(businessReservation),
    };

    // Invalidar cache de slots para este negocio
    scheduleCache.invalidate(`${business_id}:`);

    // Enviar emails en paralelo sin bloquear la respuesta ni afectar la transaccion
    Promise.allSettled([
      emailService.sendEmailToRegisterReservation(emailFieldsInformation),
      emailService.sendEmailToNewReservation(emailFieldsInformation),
    ]).then(results => {
      results.forEach(result => {
        if (result.status === "rejected") {
          console.error(
            "[EMAIL ERROR] Error al enviar email de reservacion:",
            result.reason,
          );
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
  business_id: string | string[] | undefined,
  page = 1,
  limit = 20,
) => {
  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await Reservation.findAndCountAll({
      where: { business_id },
      include: [
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity"] },
        },
        {
          model: ReservationProof,
          as: "proof_of_payments",
          attributes: ["id", "url", "status", "uploaded_by", "created_at"],
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return { reservations: rows, total: count, page, limit };
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

export const rescheduleReservation = async (
  reservationId: string,
  data: { new_date: string; new_time: string },
  user?: { userId: string; email: string; role: string },
) => {
  try {
    const emailService = new EmailService();

    const reservation = await Reservation.findByPk(reservationId, {
      include: [
        {
          model: Business,
          as: "business",
          include: [{ model: Schedule, as: "schedules" }],
        },
        { model: Product, as: "products" },
      ],
    });

    if (!reservation) throw new AppError("Reservación no encontrada.", 404);

    const businessReservation = reservation.getDataValue("business");

    // Validación de ownership
    if (user?.role !== "admin") {
      const ownerId = String(businessReservation?.getDataValue("owner_id"));
      if (!user?.userId || ownerId !== String(user.userId)) {
        throw new AppError(
          "No tienes permisos para reprogramar esta reservación.",
          403,
        );
      }
    }

    // Validación de status — no se puede reprogramar si está completada
    const currentStatus = reservation.getDataValue("status");
    if (currentStatus === "completed") {
      throw new AppError(
        "No se puede reprogramar una reservación completada.",
        422,
      );
    }

    // Construir nuevo start_time en UTC — slice(0,10) garantiza "YYYY-MM-DD" puro
    const datePart = data.new_date.slice(0, 10);
    const newStartTime = convertDateToUTC(`${datePart}T${data.new_time}:00`);

    // Validar que la nueva fecha sea en el futuro
    if (newStartTime <= new Date()) {
      throw new AppError("La nueva fecha y hora deben ser en el futuro.", 400);
    }

    // Calcular nuevo end_time a partir de la duración de los productos
    const products = reservation.getDataValue("products") as any[];
    const totalDuration = products.reduce((total: number, p: any) => {
      return (
        total + Math.trunc((p.get("estimated_delivery_time") as number) || 0)
      );
    }, 0);
    const newEndTime = addMinutesToDate(newStartTime, totalDuration);

    // Validar que el nuevo día tenga schedule activo
    const dateStr = formatInTimeZone(newStartTime, TIME_ZONE, "yyyy-MM-dd");
    const workingHours = businessReservation?.getDataValue("schedules") ?? [];
    const daySchedules = workingHours.filter(
      (s: any) => s.getDataValue("date") === dateStr,
    );

    if (daySchedules.length === 0) {
      throw new AppError("El negocio no opera el día seleccionado.", 400);
    }

    // Validar que la nueva hora esté dentro del horario laboral
    const startLocalHour = parseInt(
      formatInTimeZone(newStartTime, TIME_ZONE, "H"),
      10,
    );
    const startLocalMinute = parseInt(
      formatInTimeZone(newStartTime, TIME_ZONE, "m"),
      10,
    );
    const endLocalHour = parseInt(
      formatInTimeZone(newEndTime, TIME_ZONE, "H"),
      10,
    );
    const endLocalMinute = parseInt(
      formatInTimeZone(newEndTime, TIME_ZONE, "m"),
      10,
    );

    const withinSchedule = daySchedules.some((s: any): boolean => {
      const openTime: string = s.getDataValue("open_time");
      const closeTime: string = s.getDataValue("close_time");
      if (!openTime || !closeTime) return false;
      const [oh, om] = openTime.split(":").map(Number);
      const [ch, cm] = closeTime.split(":").map(Number);
      const startTotal = startLocalHour * 60 + startLocalMinute;
      const endTotal = endLocalHour * 60 + endLocalMinute;
      return startTotal >= oh * 60 + om && endTotal <= ch * 60 + cm;
    });

    if (!withinSchedule) {
      throw new AppError(
        "La nueva hora no está dentro del horario laboral del negocio.",
        400,
      );
    }

    // Verificar solapamiento con otras reservaciones (excluyendo la actual)
    const overlap = await Reservation.findOne({
      where: {
        business_id: reservation.getDataValue("business_id"),
        id: { [Op.ne]: reservationId },
        status: { [Op.in]: ["pending", "confirmed"] },
        [Op.and]: [
          { start_time: { [Op.lt]: newEndTime } },
          { end_time: { [Op.gt]: newStartTime } },
        ],
      },
    });

    if (overlap) {
      throw new AppError("Ya existe una reservación en el nuevo horario.", 409);
    }

    // Actualizar la reservación
    const updated = await reservation.update({
      start_time: newStartTime,
      end_time: newEndTime,
      reservation_date: newStartTime,
      status: "confirmed",
      updated_by: user?.userId ?? null,
      updated_at: new Date(),
    });

    // Invalidar cache de slots del negocio
    scheduleCache.invalidate(`${reservation.getDataValue("business_id")}:`);

    // Enviar email al cliente (no bloqueante)
    const emailBody = {
      to: reservation.getDataValue("customer_email"),
      name: reservation.getDataValue("customer_name"),
      businessName: businessReservation?.getDataValue("name"),
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString(),
      status: "confirmed",
      products,
      businessContact: businessReservation ? buildBusinessContact(businessReservation) : undefined,
    };

    Promise.allSettled([
      emailService.sendEmailToRescheduleReservation(emailBody),
    ]).then(results => {
      results.forEach(r => {
        if (r.status === "rejected") {
          console.error("[EMAIL ERROR] reschedule:", r.reason);
        }
      });
    });

    return updated;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof Error) {
      throw new Error(`Error al reprogramar la reservación: ${error.message}`);
    }
    throw new Error("Error al reprogramar la reservación: Error desconocido");
  }
};

export const createReservationProof = async (
  reservationId: string,
  url: string,
  publicId: string,
  uploadedBy?: string,
) => {
  const reservation = await Reservation.findByPk(reservationId);
  if (!reservation) throw new AppError("Reservación no encontrada.", 404);

  const proof = await ReservationProof.create({
    reservation_id: reservationId,
    url,
    public_id: publicId,
    uploaded_by: uploadedBy ?? null,
    status: "pending",
  });

  return proof;
};

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
          include: [
            { model: Schedule, as: "schedules" },
            { model: User, as: "user" },
          ],
        },
        {
          model: Product,
          as: "products",
          through: { attributes: ["quantity"] },
        },
      ],
    });

    if (!reservation) throw new AppError("Reservación no encontrada.", 404);

    const businessReservation = reservation.getDataValue("business");

    // Validación de ownership
    if (user?.role !== "admin") {
      const ownerId = String(businessReservation?.getDataValue("owner_id"));
      if (!user?.userId || ownerId !== String(user.userId)) {
        throw new AppError(
          "No tienes permisos para modificar esta reservación.",
          403,
        );
      }
    }

    if (reservation.getDataValue("status") === ReservationStatus.COMPLETED) {
      throw new AppError(
        "No se puede actualizar una reservación completada.",
        422,
      );
    }

    // Validaciones de horario y solapamiento solo al confirmar
    if (statusData.status === ReservationStatus.CONFIRMED) {
      const startTime = reservation.getDataValue("start_time") as Date;
      const endTime = reservation.getDataValue("end_time") as Date;
      const businessId = reservation.getDataValue("business_id");

      // Validar que el día tenga horario activo
      const dateStr = formatInTimeZone(startTime, TIME_ZONE, "yyyy-MM-dd");
      const workingHours = businessReservation?.getDataValue("schedules") ?? [];
      const daySchedules = workingHours.filter(
        (s: any) => s.getDataValue("date") === dateStr,
      );

      if (daySchedules.length === 0) {
        throw new AppError(
          "El negocio no opera el día de la reservación.",
          400,
        );
      }

      // Validar que la hora esté dentro del horario laboral
      const startLocalHour = parseInt(formatInTimeZone(startTime, TIME_ZONE, "H"), 10);
      const startLocalMinute = parseInt(formatInTimeZone(startTime, TIME_ZONE, "m"), 10);
      const endLocalHour = parseInt(formatInTimeZone(endTime, TIME_ZONE, "H"), 10);
      const endLocalMinute = parseInt(formatInTimeZone(endTime, TIME_ZONE, "m"), 10);

      const withinSchedule = daySchedules.some((s: any): boolean => {
        const openTime: string = s.getDataValue("open_time");
        const closeTime: string = s.getDataValue("close_time");
        if (!openTime || !closeTime) return false;
        const [oh, om] = openTime.split(":").map(Number);
        const [ch, cm] = closeTime.split(":").map(Number);
        const startTotal = startLocalHour * 60 + startLocalMinute;
        const endTotal = endLocalHour * 60 + endLocalMinute;
        return startTotal >= oh * 60 + om && endTotal <= ch * 60 + cm;
      });

      if (!withinSchedule) {
        throw new AppError(
          "La reservación está fuera del horario laboral del negocio.",
          400,
        );
      }

      // Verificar solapamiento con otras reservaciones ya confirmadas
      const overlap = await Reservation.findOne({
        where: {
          business_id: businessId,
          id: { [Op.ne]: reservationId },
          status: ReservationStatus.CONFIRMED,
          [Op.and]: [
            { start_time: { [Op.lt]: endTime } },
            { end_time: { [Op.gt]: startTime } },
          ],
        },
      });

      if (overlap) {
        throw new AppError(
          "Ya existe una reservación confirmada en ese horario.",
          409,
        );
      }
    }

    const updatedReservation = await reservation.update({
      status: statusData.status,
      updated_by: user?.userId ?? null,
      updated_at: new Date(),
    });

    scheduleCache.invalidate(`${reservation.getDataValue("business_id")}:`);

    const emailBody = {
      to: reservation.getDataValue("customer_email"),
      name: reservation.getDataValue("customer_name"),
      businessName: businessReservation?.getDataValue("name"),
      startTime: reservation.getDataValue("start_time"),
      endTime: reservation.getDataValue("end_time"),
      status: statusData.status,
      products: reservation.getDataValue("products"),
      businessContact: businessReservation ? buildBusinessContact(businessReservation) : undefined,
    };

    // Fix 3: emails no bloqueantes con Promise.allSettled
    if (statusData.status === ReservationStatus.CONFIRMED) {
      Promise.allSettled([
        emailService.sendEmailToConfirmReservation(emailBody),
      ]).then(results => {
        results.forEach(r => {
          if (r.status === "rejected")
            console.error("[EMAIL ERROR] confirm:", r.reason);
        });
      });
    } else if (statusData.status === ReservationStatus.CANCELLED) {
      const ownerEmail = businessReservation?.getDataValue("user")?.getDataValue("email");
      Promise.allSettled([
        emailService.sendEmailToCancelReservation(emailBody),
        ...(ownerEmail ? [emailService.sendEmailToClientCancellation({
          to: ownerEmail,
          name: reservation.getDataValue("customer_name"),
          businessName: businessReservation?.getDataValue("name"),
          startTime: reservation.getDataValue("start_time"),
          endTime: reservation.getDataValue("end_time"),
          products: reservation.getDataValue("products") ?? [],
          customerEmail: reservation.getDataValue("customer_email"),
          reservationId,
        })] : []),
      ]).then(results => {
        results.forEach(r => {
          if (r.status === "rejected")
            console.error("[EMAIL ERROR] cancel:", r.reason);
        });
      });
    }

    return updatedReservation;
  } catch (error) {
    // Fix 6: re-lanza AppError sin envolver para preservar el status code
    if (error instanceof AppError) throw error;
    if (error instanceof Error)
      throw new Error(`Error al actualizar la reservación: ${error.message}`);
    throw new Error("Error al actualizar la reservación: Error desconocido");
  }
};
