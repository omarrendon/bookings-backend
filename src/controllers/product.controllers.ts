// Dependencies
import { Request, Response } from "express";
//Models
import { Product } from "../models/product.model";
//Schemas
import productSchema from "../schemas/product.schema";
//Services
import { saveProduct } from "../services/product.services";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Campos requeridos faltantes o inválidos",
        success: false,
      });
    }

    const { newProduct } = await saveProduct(value, userId);

    res.status(201).json({
      message: "Producto creado correctamente",
      success: true,
      data: newProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error al crear producto : ${error}`, success: false });
  }
};
