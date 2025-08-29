// Models
import { Op } from "sequelize";
import Business from "../models/business.model";
import Reservation from "../models/reservation.model";
import Schedule from "../models/schedule.model";
import {
  addHours,
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  parseISO,
  startOfMonth,
} from "date-fns";

interface ScheduleData {
  business_id: string;
  hours: {
    day: string;
    open_time: string | null;
    close_time: string | null;
  }[];
}

export const createSchedule = async (scheduleData: ScheduleData) => {
  try {
    const { business_id, hours } = scheduleData;
    const createSchedule = await Schedule.bulkCreate(
      hours.map(hour => ({
        day: hour.day,
        open_time: hour.open_time,
        close_time: hour.close_time,
        business_id: business_id,
      }))
    );

    if (!createSchedule) {
      throw new Error("Se produjo un error al crear el horario.");
    }
    return { newSchedule: createSchedule };
  } catch (error) {
    throw new Error("Error al crear el horario: " + error);
  }
};

export const getSchedulesByBusiness = async (
  businessId: string,
  date: string
) => {
  try {
    const startMonth = parseISO(date);
    const endMonth = endOfMonth(startMonth);

    const schedules = await Schedule.findAll({
      where: { business_id: businessId },
    });
    if (!schedules) return { month: startMonth, slots: [] };

    const reservations = await Reservation.findAll({
      where: {
        business_id: businessId,
        start_time: {
          [Op.between]: [startOfMonth(startMonth), endMonth],
        },
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
    const daysInMonth = eachDayOfInterval({ start: startMonth, end: endMonth });

    for (const day of daysInMonth) {
      const dayOfWeek = day.getDay(); // 0 (Domingo) a 6 (Sábado)
      const mappedDay = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = mappedDay[dayOfWeek];

      // Horarios aplicables a ese día
      const daySchedules = schedules.filter(
        schedule => schedule.getDataValue("day") === dayName
      );
      if (!daySchedules.length) {
        days.push({ date: format(day, "yyyy-MM-dd"), slots: [] });
        continue;
      }

      const slots: { start: string; end: string; isBooked: boolean }[] = [];
      for (const schedule of daySchedules) {
        let currentOpenTime = new Date(
          `${format(day, "yyyy-MM-dd")}T${schedule.getDataValue("open_time")}`
        );
        const currentCloseTime = new Date(
          `${format(day, "yyyy-MM-dd")}T${schedule.getDataValue("close_time")}`
        );

        // Verificar si este intervalo está ocupado
        while (isBefore(currentOpenTime, currentCloseTime)) {
          const nextHour = addHours(currentOpenTime, 1);
          const isOccupied = reservationsRanges.some(
            range =>
              (currentOpenTime >= range.start_time &&
                currentOpenTime < range.end_time) ||
              (nextHour > range.start_time && nextHour <= range.end_time)
          );
          slots.push({
            start: format(currentOpenTime, "HH:mm"),
            end: format(nextHour, "HH:mm"),
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

export const updateSchedule = async (scheduleData: ScheduleData) => {
  try {
    const { hours } = scheduleData;

    // Elimina los horarios existentes para el negocio
    await Schedule.destroy({
      where: { business_id: scheduleData.business_id },
    });

    // Inserta todos los nuevos registros recibidos en la petición
    const updatedHoursResults = await Schedule.bulkCreate(
      hours.map(hour => ({
        day: hour.day,
        open_time: hour.open_time,
        close_time: hour.close_time,
        business_id: scheduleData.business_id,
      }))
    );

    if (!updatedHoursResults) {
      throw new Error("No se pudo actualizar el horario del negocio.");
    }
    return { updatedSchedule: updatedHoursResults };
  } catch (error) {
    throw new Error("Error al actualizar el horario: " + error);
  }
};
