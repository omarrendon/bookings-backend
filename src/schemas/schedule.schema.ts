// Dependencies
import Joi from "joi";

export const createScheduleSchema = Joi.object({
  day: Joi.string()
    .valid(
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    )
    .required(),
  open_time: Joi.string().required().max(5), // HH:mm format
  close_time: Joi.string().required().max(5), // HH:mm format
  business_id: Joi.string().required(),
});
