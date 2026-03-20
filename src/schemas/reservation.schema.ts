import Joi from "joi";

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
  user_id: Joi.string().optional(),
  customer_name: Joi.string().required().max(255),
  customer_email: Joi.string().email().required().max(255),
  customer_phone: Joi.string().required().max(20),
  proof_of_payment: Joi.string().optional().max(500),
  start_time: Joi.date().required(),
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
