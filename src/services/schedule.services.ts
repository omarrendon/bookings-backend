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
