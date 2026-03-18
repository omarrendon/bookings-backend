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

const timePattern = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

const hourSchema = Joi.object({
  day: Joi.string().valid(...validDays).required(),
  open_time: Joi.string().pattern(timePattern).allow(null).default(null),
  close_time: Joi.string().pattern(timePattern).allow(null).default(null),
})
  .custom((value, helpers) => {
    const { open_time, close_time } = value;
    if ((open_time === null) !== (close_time === null)) {
      return helpers.error("hours.nullMismatch");
    }
    if (open_time && close_time && open_time >= close_time) {
      return helpers.error("hours.invalidRange");
    }
    return value;
  })
  .messages({
    "hours.nullMismatch":
      "open_time y close_time deben ser ambos nulos o ambos tener un valor.",
    "hours.invalidRange": "open_time debe ser anterior a close_time.",
  });

export const createScheduleSchema = Joi.object({
  business_id: Joi.number().integer().positive().required(),
  hours: Joi.array().items(hourSchema).min(1).required(),
});

export const updateScheduleSchema = Joi.object({
  hours: Joi.array().items(hourSchema).min(1).required(),
});
