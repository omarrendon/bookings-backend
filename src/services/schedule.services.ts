// Models
import Business from "../models/business.model";
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
