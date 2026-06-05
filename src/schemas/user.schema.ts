import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  last_name: Joi.string().min(2).optional(),
  email: Joi.string().email().optional(),
}).min(1);
