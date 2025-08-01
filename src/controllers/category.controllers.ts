// Dependencias
import { Request, Response } from "express";

// Services
import { createCategoryInDB } from "../services/catogory.services";

// Schemas
import { categorySchema } from "../schemas/category.schema";

export async function createCategory(req: Request, res: Response) {
  const { name, description } = req.body;

  try {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }
    const category = await createCategoryInDB({ name, description });
    return res.status(201).json({
      message: "Categoría creada exitosamente.",
      data: category,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: `${error}.`, success: false });
  }
}
