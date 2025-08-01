// Dependencies
import Joi from "joi";

// Schema
const productSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  gallery_images: Joi.array().items(Joi.string()),
  business_id: Joi.string().required(),
  category_id: Joi.string(),
  estimated_delivery_time: Joi.number().min(0).required(),
});

export default productSchema;
