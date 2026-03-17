// Dependencies
import Joi from "joi";

// Schema
export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  gallery_images: Joi.array().items(Joi.string()),
  business_id: Joi.string().required(),
  category_id: Joi.string(),
  estimated_delivery_time: Joi.number().min(0).required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  stock: Joi.number().integer().min(0).optional(),
  gallery_images: Joi.array().items(Joi.string()).optional(),
  category_id: Joi.string().optional(),
  estimated_delivery_time: Joi.number().min(0).optional(),
}).min(1);
