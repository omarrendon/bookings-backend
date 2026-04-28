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
import { scheduleCache } from "../utils/scheduleCache";

const TIME_ZONE = process.env.TIMEZONE || "America/Mexico_City";

interface HourEntry {
  day: string;
  open_time: string | null;
  close_time: string | null;
}

interface ScheduleData {
  business_id: string;
  date_from: string;
  date_to: string;
  hours: HourEntry[];
}

// Genera los registros individuales por fecha a partir de un rango + patrón semanal
const expandDatesToRecords = (
  business_id: string,
  date_from: string,
  date_to: string,
  hours: HourEntry[],
) => {
  const start = parseISO(date_from);
  const end = parseISO(date_to);
  const days = eachDayOfInterval({ start, end });

  const records: {
    date: string;
    open_time: string | null;
    close_time: string | null;
    business_id: string;
  }[] = [];

  for (const day of days) {
    const dayName = format(day, "EEEE"); // "Monday", "Tuesday", etc.
    const matchingHours = hours.filter(h => h.day === dayName);

    for (const hourEntry of matchingHours) {
      records.push({
        date: format(day, "yyyy-MM-dd"),
        open_time: hourEntry.open_time,
        close_time: hourEntry.close_time,
        business_id,
      });
    }
  }

  return records;
};

export const createSchedule = async (scheduleData: ScheduleData) => {
  try {
    const { business_id, date_from, date_to, hours } = scheduleData;
    const records = expandDatesToRecords(business_id, date_from, date_to, hours);
    const newSchedule = await Schedule.bulkCreate(records);
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
    const cacheKey = `${businessId}:${format(startMonth, "yyyy-MM")}`;
    const cached = scheduleCache.get(cacheKey);
    if (cached) return cached;

    const startOfMonthDate = startOfMonth(startMonth);
    const endOfMonthDate = endOfMonth(startMonth);
    const startStr = format(startOfMonthDate, "yyyy-MM-dd");
    const endStr = format(endOfMonthDate, "yyyy-MM-dd");

    const schedules = await Schedule.findAll({
      where: {
        business_id: businessId,
        date: { [Op.between]: [startStr, endStr] },
      },
    });

    if (schedules.length === 0) return { month: startMonth, slots: [] };

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
      const dateStr = format(day, "yyyy-MM-dd");

      const daySchedules = schedules.filter(
        schedule => schedule.getDataValue("date") === dateStr,
      );

      if (!daySchedules.length) {
        days.push({ date: dateStr, slots: [] });
        continue;
      }

      const slots: { start: string; end: string; isBooked: boolean }[] = [];

      for (const schedule of daySchedules) {
        const openTime = schedule.getDataValue("open_time");
        const closeTime = schedule.getDataValue("close_time");
        if (!openTime || !closeTime) continue;

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

      days.push({ date: dateStr, slots });
    }

    const result = { month: startMonth, slots: days };
    scheduleCache.set(cacheKey, result);
    return result;
  } catch (error) {
    throw new Error("Error al obtener horarios: " + error);
  }
};

export const updateSchedule = async (
  scheduleId: string,
  data: { date_from: string; date_to: string; hours: HourEntry[] },
) => {
  const t = await sequelize.transaction();
  try {
    const existing = await Schedule.findByPk(scheduleId, { transaction: t });
    if (!existing) throw new AppError("Horario no encontrado.", 404);

    const business_id = existing.getDataValue("business_id");
    const { date_from, date_to, hours } = data;

    // Eliminar todos los registros del negocio dentro del rango de fechas
    await Schedule.destroy({
      where: {
        business_id,
        date: { [Op.between]: [date_from, date_to] },
      },
      transaction: t,
    });

    const records = expandDatesToRecords(business_id, date_from, date_to, hours);
    const updatedSchedule = await Schedule.bulkCreate(records, { transaction: t });

    await t.commit();
    scheduleCache.invalidate(`${business_id}:`);
    return { updatedSchedule };
  } catch (error) {
    await t.rollback();
    if (error instanceof AppError) throw error;
    throw new Error("Error al actualizar el horario: " + error);
  }
};

export const getScheduleConfig = async (businessId: string) => {
  try {
    const schedules = await Schedule.findAll({
      where: { business_id: businessId },
      order: [["date", "ASC"]],
    });
    return { schedules };
  } catch (error) {
    throw new Error("Error al obtener configuración de horarios: " + error);
  }
};
