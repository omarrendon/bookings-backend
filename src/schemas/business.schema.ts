import Joi from "joi";

export const createBussinessSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(10),
  phone_number: Joi.string().min(10),
  website: Joi.string().uri().optional(),
  street: Joi.string().min(5).max(100).required(),
  external_number: Joi.string().min(1).max(10).required(),
  internal_number: Joi.string().max(10).optional(),
  neighborhood: Joi.string().min(2).max(100).optional(),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string().min(2).max(50).required(),
  zip_code: Joi.string().min(5).max(10).required(),
  country: Joi.string().min(2).max(50).optional().default("México"),
  social_links: Joi.array()
    .items(
      Joi.object({
        platform: Joi.string().required(),
        url: Joi.string().uri().required(),
      })
    )
    .optional(),
  main_image_url: Joi.string().uri().optional(),
  gallery_images: Joi.array().items(Joi.string().uri()).optional(),
  is_verified: Joi.boolean().default(false),
  hours_of_operation: Joi.array()
    .items(
      Joi.object({
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
        open: Joi.string()
          .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
          .required(),
        close: Joi.string()
          .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
          .required(),
      })
    )
    .required(),
  raiting: Joi.number().min(0).max(5).optional(),
  owner_id: Joi.string().required(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
});
