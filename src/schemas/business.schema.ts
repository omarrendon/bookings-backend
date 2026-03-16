import Joi from "joi";

export const createBusinessSchema = Joi.object({
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
      }),
    )
    .optional(),
  main_image_url: Joi.string().uri().optional(),
  gallery_images: Joi.array().items(Joi.string().uri()).optional(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
});

export const updateBusinessSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  description: Joi.string().min(10).optional(),
  phone_number: Joi.string().min(10).optional(),
  website: Joi.string().uri().optional(),
  street: Joi.string().min(5).max(100).optional(),
  external_number: Joi.string().min(1).max(10).optional(),
  internal_number: Joi.string().max(10).optional(),
  neighborhood: Joi.string().min(2).max(100).optional(),
  city: Joi.string().min(2).max(50).optional(),
  state: Joi.string().min(2).max(50).optional(),
  zip_code: Joi.string().min(5).max(10).optional(),
  country: Joi.string().min(2).max(50).optional(),
  social_links: Joi.array()
    .items(
      Joi.object({
        platform: Joi.string().required(),
        url: Joi.string().uri().required(),
      }),
    )
    .optional(),
  main_image_url: Joi.string().uri().optional(),
  gallery_images: Joi.array().items(Joi.string().uri()).optional(),
}).min(1);
