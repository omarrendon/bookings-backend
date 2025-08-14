// Dependencies
import { Request, Response } from "express";
//Schemas
import productSchema from "../schemas/product.schema";
//Services
import {
  destroyProduct,
  getAllProducts,
  saveProduct,
  updateExistentProduct,
} from "../services/product.services";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role?: string };
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

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "ID de negocio no proporcionado.",
        success: false,
      });
    }

    const products = await getAllProducts(id);
    res.status(200).json({
      message: "Productos obtenidos correctamente",
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error al obtener productos : ${error}`,
      success: false,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    console.log("Deleting product...");
    const productId = req.params.id;
    console.log("Ptoduct id:", productId);
    const userId = req.user?.userId;
    console.log("User id:", userId);

    if (!productId || !userId) {
      throw new Error("ID de producto o usuario no proporcionado.");
    }

    const { message } = await destroyProduct(productId, userId);
    if (!message) {
      return res.status(404).json({
        message: "Producto no encontrado o no autorizado",
        success: false,
      });
    }

    res.status(200).json({
      message,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error al eliminar producto : ${error}`,
      success: false,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const userId = req.user?.userId;

    if (!productId || !userId) {
      throw new Error("ID de producto o usuario no proporcionado.");
    }

    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Campos requeridos faltantes o inválidos",
        success: false,
      });
    }
    const { message, product } = await updateExistentProduct(
      productId,
      userId,
      value
    );
    res.status(200).json({
      message,
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error al actualizar producto : ${error}`,
      success: false,
    });
  }
};
