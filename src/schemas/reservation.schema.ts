import Joi from "joi";

export const createReservationSchema = Joi.object({
  business_id: Joi.string().required(),
  user_id: Joi.string().optional(),
  reservation_date: Joi.date().required(),
  customer_name: Joi.string().required().max(255),
  customer_email: Joi.string().email().required().max(255),
  customer_phone: Joi.string().required().max(20),
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
