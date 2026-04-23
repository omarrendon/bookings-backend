import Joi from "joi";

export const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      "string.min": "La contraseña debe tener mínimo 8 caracteres.",
      "string.pattern.base":
        "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&).",
    }),
  role: Joi.string().required().valid("user", "admin", "owner"),
});
