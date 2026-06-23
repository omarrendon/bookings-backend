import Joi from "joi";

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
