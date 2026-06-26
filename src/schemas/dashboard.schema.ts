import Joi from "joi";

export const dashboardQuerySchema = Joi.object({
  period: Joi.number().valid(7, 30, 90).default(30).messages({
    "any.only": "El periodo debe ser 7, 30 o 90 días.",
  }),
});
