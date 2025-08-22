// Models
import Business from "../models/business.model";
import Schedule from "../models/schedule.model";

export const getSchedulesByBusiness = async (businessId: string) => {
  try {
    const schedulesBusiness = await Schedule.findOne({
      where: { business_id: businessId },
      include: [
        {
          model: Business,
          as: "business",
        },
      ],
    });
    if (!schedulesBusiness) {
      throw new Error("No se encontraron horarios para este negocio.");
    }
    return { schedulesBusiness };
  } catch (error) {
    throw new Error("Error fetching schedules");
  }
};
