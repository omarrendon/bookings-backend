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

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const validateNoOverlaps = (value: { hours: { day: string; open_time: string | null; close_time: string | null }[] }, helpers: Joi.CustomHelpers) => {
  const byDay: Record<string, { open_time: string; close_time: string }[]> = {};

  for (const entry of value.hours) {
    if (!entry.open_time || !entry.close_time) continue;
    if (!byDay[entry.day]) byDay[entry.day] = [];
    byDay[entry.day].push({ open_time: entry.open_time, close_time: entry.close_time });
  }

  for (const day of Object.keys(byDay)) {
    const blocks = byDay[day].sort((a, b) => toMinutes(a.open_time) - toMinutes(b.open_time));

    for (let i = 0; i < blocks.length - 1; i++) {
      if (toMinutes(blocks[i].close_time) > toMinutes(blocks[i + 1].open_time)) {
        return helpers.error("hours.overlap", { day, block: `${blocks[i].open_time}–${blocks[i].close_time} se solapa con ${blocks[i + 1].open_time}–${blocks[i + 1].close_time}` });
      }
    }
  }

  return value;
};

export const createScheduleSchema = Joi.object({
  business_id: Joi.number().integer().positive().required(),
  date_from: Joi.string().isoDate().required(),
  date_to: Joi.string().isoDate().required(),
  slot_duration_minutes: Joi.number().integer().min(15).max(480).default(60),
  hours: Joi.array().items(hourSchema).min(1).required(),
})
  .custom((value, helpers) => {
    if (new Date(value.date_from) > new Date(value.date_to)) {
      return helpers.error("date.invalidRange");
    }
    return validateNoOverlaps(value, helpers);
  })
  .messages({
    "date.invalidRange": "date_from debe ser anterior o igual a date_to.",
    "hours.overlap": "Los bloques horarios del {{#day}} se solapan: {{#block}}.",
  });

export const updateScheduleSchema = Joi.object({
  date_from: Joi.string().isoDate().required(),
  date_to: Joi.string().isoDate().required(),
  slot_duration_minutes: Joi.number().integer().min(15).max(480).default(60),
  hours: Joi.array().items(hourSchema).min(1).required(),
})
  .custom((value, helpers) => {
    if (new Date(value.date_from) > new Date(value.date_to)) {
      return helpers.error("date.invalidRange");
    }
    return validateNoOverlaps(value, helpers);
  })
  .messages({
    "date.invalidRange": "date_from debe ser anterior o igual a date_to.",
    "hours.overlap": "Los bloques horarios del {{#day}} se solapan: {{#block}}.",
  });
