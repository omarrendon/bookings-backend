// Models
import { Op } from "sequelize";
import Business from "../models/business.model";
import Reservation from "../models/reservation.model";
import Schedule from "../models/schedule.model";

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

export const getSchedulesByBusiness = async (businessId: string) => {
  try {
    const schedulesBusiness = await Schedule.findAll({
      where: { business_id: businessId },
      include: [
        {
          model: Business,
          as: "business",
        },
      ],
    });
    if (!schedulesBusiness) return { slots: [] };

    const reservations = await Reservation.findAll({
      where: {
        business_id: businessId,
        // start_time: { [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
      },
    });
    const reservationsRanges = reservations.map(reservation => ({
      start_time: reservation.get("start_time"),
      end_time: reservation.get("end_time"),
    }));
    console.log("Reservations ranges -----", reservationsRanges);

    const slots: { start: string; end: string; isBooked: boolean }[] = [];

    for (const schedule of schedulesBusiness) {
      // const day = schedule.get("day");
      const open_time = schedule.get("open_time");
      const close_time = schedule.get("close_time");

      if (open_time && close_time) {
        // Crear slots de 60 minutos
        // let currentTime = new Date(`T${open_time}Z`);
        // const endTime = new Date(`T${close_time}Z`);
        // while (currentTime < endTime) {
        //   const slotStart = currentTime.toISOString().substring(11, 16);
        //   currentTime.setMinutes(currentTime.getMinutes() + 30);
        //   const slotEnd = currentTime.toISOString().substring(11, 16);
        //   // Verificar si el slot está reservado
        //   const isBooked = reservationsRanges.some(reservation => {
        //     const reservationStart = new Date(reservation.start_time as string);
        //     const reservationEnd = new Date(reservation.end_time as string);
        //     const slotStartDate = new Date(`1970-01-01T${slotStart}Z`);
        //     const slotEndDate = new Date(`1970-01-01T${slotEnd}Z`);
        //     return (
        //       (slotStartDate >= reservationStart &&
        //         slotStartDate < reservationEnd) ||
        //       (slotEndDate > reservationStart &&
        //         slotEndDate <= reservationEnd) ||
        //       (slotStartDate <= reservationStart &&
        //         slotEndDate >= reservationEnd)
        //     );
        //   });
        //   slots.push({ start: slotStart, end: slotEnd, isBooked });
        // }
      }
    }

    return schedulesBusiness;
  } catch (error) {
    throw new Error("Error al obtener horarios: " + error);
  }
};

export const updateSchedule = async (
  scheduleId: string,
  scheduleData: ScheduleData
) => {
  try {
    console.log("Updating schedule servce -------", scheduleId);
    const scheduleDataUpdated = await Schedule.findOne({
      where: {
        id: 12,
      },
    });
    console.log("Found schedule to update:", scheduleDataUpdated);

    if (!scheduleDataUpdated) {
      throw new Error("No se encontró el horario a actualizar.");
    }

    const [scheduleUpdated] = await Schedule.update(scheduleData, {
      where: { id: scheduleId },
    });

    if (!scheduleUpdated) {
      throw new Error("No se pudo actualizar el horario del negocio.");
    }

    return { updatedSchedule: scheduleData };
  } catch (error) {
    throw new Error("Error al actualizar el horario: " + error);
  }
};
