// Dependencies
import { Op } from "sequelize";
import {
  addHours,
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  parseISO,
  startOfMonth,
} from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
// Models
import Reservation from "../models/reservation.model";
import Schedule from "../models/schedule.model";
// Database
import { sequelize } from "../database/sequelize";
// Utils
import { AppError } from "../utils/AppError";

const TIME_ZONE = process.env.TIMEZONE || "America/Mexico_City";

interface HourEntry {
  day: string;
  open_time: string | null;
  close_time: string | null;
}

export const createSchedule = async (scheduleData: {
  business_id: string;
  hours: HourEntry[];
}) => {
  try {
    const { business_id, hours } = scheduleData;
    const newSchedule = await Schedule.bulkCreate(
      hours.map(hour => ({
        day: hour.day,
        open_time: hour.open_time,
        close_time: hour.close_time,
        business_id,
      })),
    );
    return { newSchedule };
  } catch (error) {
    throw new Error("Error al crear el horario: " + error);
  }
};

export const getSchedulesByBusiness = async (
  businessId: string,
  date: string,
) => {
  try {
    const startMonth = parseISO(date);
    const startOfMonthDate = startOfMonth(startMonth);
    const endOfMonthDate = endOfMonth(startMonth);

    const schedules = await Schedule.findAll({
      where: { business_id: businessId },
    });

    if (schedules.length === 0) return { month: startMonth, slots: [] };

    // Incluir reservaciones que solapen con el mes completo, no solo las que empiezan en él
    const reservations = await Reservation.findAll({
      where: {
        business_id: businessId,
        status: ["pending", "confirmed"],
        [Op.and]: [
          { start_time: { [Op.lt]: endOfMonthDate } },
          { end_time: { [Op.gt]: startOfMonthDate } },
        ],
      },
    });

    const reservationsRanges = reservations.map(reservation => ({
      start_time: reservation.get("start_time") as Date,
      end_time: reservation.get("end_time") as Date,
    }));

    const days: {
      date: string;
      slots: { start: string; end: string; isBooked: boolean }[];
    }[] = [];

    const daysInMonth = eachDayOfInterval({
      start: startOfMonthDate,
      end: endOfMonthDate,
    });

    for (const day of daysInMonth) {
      // Usar la zona horaria del negocio para determinar el día de la semana correctamente
      const dayName = formatInTimeZone(day, TIME_ZONE, "EEEE");

      const daySchedules = schedules.filter(
        schedule => schedule.getDataValue("day") === dayName,
      );

      if (!daySchedules.length) {
        days.push({ date: format(day, "yyyy-MM-dd"), slots: [] });
        continue;
      }

      const slots: { start: string; end: string; isBooked: boolean }[] = [];
      const dateStr = formatInTimeZone(day, TIME_ZONE, "yyyy-MM-dd");

      for (const schedule of daySchedules) {
        const openTime = schedule.getDataValue("open_time");
        const closeTime = schedule.getDataValue("close_time");
        if (!openTime || !closeTime) continue;

        // Construir fechas en la zona horaria del negocio, no del servidor
        let currentOpenTime = fromZonedTime(
          `${dateStr}T${openTime}`,
          TIME_ZONE,
        );
        const currentCloseTime = fromZonedTime(
          `${dateStr}T${closeTime}`,
          TIME_ZONE,
        );

        while (isBefore(currentOpenTime, currentCloseTime)) {
          const nextHour = addHours(currentOpenTime, 1);

          // Overlap correcto: cubre también el caso donde la reserva engloba el slot completamente
          const isOccupied = reservationsRanges.some(
            range =>
              currentOpenTime < range.end_time && nextHour > range.start_time,
          );

          slots.push({
            start: formatInTimeZone(currentOpenTime, TIME_ZONE, "HH:mm"),
            end: formatInTimeZone(nextHour, TIME_ZONE, "HH:mm"),
            isBooked: isOccupied,
          });
          currentOpenTime = nextHour;
        }
      }

      days.push({ date: format(day, "yyyy-MM-dd"), slots });
    }

    return { month: startMonth, slots: days };
  } catch (error) {
    throw new Error("Error al obtener horarios: " + error);
  }
};

export const updateSchedule = async (
  scheduleId: string,
  hours: HourEntry[],
) => {
  const t = await sequelize.transaction();
  try {
    // Obtener business_id del registro existente — no confiar en el body
    const existing = await Schedule.findByPk(scheduleId, { transaction: t });
    if (!existing) throw new AppError("Horario no encontrado.", 404);

    const business_id = existing.getDataValue("business_id");

    await Schedule.destroy({
      where: { business_id },
      transaction: t,
    });

    const updatedHoursResults = await Schedule.bulkCreate(
      hours.map(hour => ({
        day: hour.day,
        open_time: hour.open_time,
        close_time: hour.close_time,
        business_id,
      })),
      { transaction: t },
    );

    await t.commit();
    return { updatedSchedule: updatedHoursResults };
  } catch (error) {
    await t.rollback();
    if (error instanceof AppError) throw error;
    throw new Error("Error al actualizar el horario: " + error);
  }
};
