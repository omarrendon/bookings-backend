import Joi from "joi";

const VALID_STATUSES = [
  "pending", "confirmed", "cancelled", "completed",
  "rescheduled", "expired", "in_progress", "waiting",
  "declined", "no_show", "checked_in", "checked_out",
  "waiting_for_confirmation",
];

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const reservationFiltersSchema = Joi.object({
  page:           Joi.number().integer().min(1).default(1),
  limit:          Joi.number().integer().min(1).max(100).default(20),
  date_from:      Joi.string().pattern(datePattern).optional().messages({
    "string.pattern.base": "date_from debe tener formato YYYY-MM-DD.",
  }),
  date_to:        Joi.string().pattern(datePattern).optional().messages({
    "string.pattern.base": "date_to debe tener formato YYYY-MM-DD.",
  }),
  status:         Joi.string()
    .optional()
    .custom((value, helpers) => {
      const parts = value.split(",").map((s: string) => s.trim());
      const invalid = parts.filter((s: string) => !VALID_STATUSES.includes(s));
      if (invalid.length > 0)
        return helpers.error("status.invalid", { invalid: invalid.join(", ") });
      return value;
    })
    .messages({ "status.invalid": "Status inválidos: {{#invalid}}." }),
  customer_name:  Joi.string().max(255).optional(),
  customer_email: Joi.string().max(255).optional(),
  customer_phone: Joi.string().max(20).optional(),
}).custom((value, helpers) => {
  if (value.date_from && value.date_to && value.date_from > value.date_to)
    return helpers.error("date.invalidRange");
  return value;
}).messages({ "date.invalidRange": "date_from debe ser anterior o igual a date_to." });

export const rescheduleReservationSchema = Joi.object({
  new_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "La fecha debe tener formato YYYY-MM-DD.",
      "any.required": "La nueva fecha es requerida.",
    }),
  new_time: Joi.string()
    .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "La hora debe tener formato HH:mm.",
      "any.required": "La nueva hora es requerida.",
    }),
});

export const updateReservationSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "cancelled", "completed")
    .required()
    .messages({
      "any.only":
        'El estado debe ser uno de los siguientes: pending, confirmed, cancelled, completed.',
      "any.required": "El estado es requerido.",
    }),
});

export const createReservationSchema = Joi.object({
  business_id: Joi.string().required(),
  customer_name: Joi.string().required().max(255),
  customer_email: Joi.string().email().required().max(255),
  customer_phone: Joi.string().required().max(20),
  proof_of_payment: Joi.string().optional().max(500),
  notes: Joi.string().max(1000).optional().allow(""),
  start_time: Joi.date().greater("now").required().messages({
    "date.greater": "La fecha de la reservación debe ser en el futuro.",
  }),
  products: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.string().required(),
        quantity: Joi.number().integer().min(1).optional().default(1),
      })
    )
    .min(1)
    .required(),
});
