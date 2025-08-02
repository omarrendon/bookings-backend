// Dependencias
import { Request, Response } from "express";

// Services
import { saveCategory } from "../services/catogory.services";

// Schemas
import { categorySchema } from "../schemas/category.schema";

export async function createCategory(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { error, value } = categorySchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }
    const category = await saveCategory({ ...value }, userId);
    return res.status(201).json({
      message: "Categoría creada exitosamente.",
      data: category,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: `${error}.`, success: false });
  }
}
