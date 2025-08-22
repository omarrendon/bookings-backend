// Dependencies
import Joi from "joi";

const validDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const createScheduleSchema = Joi.object({
  business_id: Joi.number().integer().positive().required(),
  hours: Joi.array()
    .items(
      Joi.object({
        day: Joi.string()
          .valid(...validDays)
          .required(),
        open_time: Joi.string()
          .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
          .allow(null), // puede ser null si está cerrado
        close_time: Joi.string()
          .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
          .allow(null), // puede ser null si está cerrado
      })
    )
    .length(7) // deben venir exactamente 7 días
    .required(),
});
