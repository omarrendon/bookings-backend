// Dependencies
import { Request, Response } from "express";
//Services
import {
  destroyProduct,
  getAllProducts,
  saveProduct,
  updateExistentProduct,
} from "../services/product.services";
import { AppError } from "../utils/AppError";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { newProduct } = await saveProduct(req.body);
    res.status(201).json({
      message: "Producto creado correctamente",
      success: true,
      data: newProduct,
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[createProduct]", error);
    res.status(statusCode).json({ message, success: false });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    if (!businessId) {
      return res.status(400).json({
        message: "ID de negocio no proporcionado.",
        success: false,
      });
    }

    const products = await getAllProducts(businessId);
    res.status(200).json({
      message: "Productos obtenidos correctamente",
      success: true,
      data: products,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[getProducts]", error);
    res.status(500).json({ message, success: false });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const userId = req.user?.userId;

    if (!productId || !userId) {
      throw new Error("Id de producto o usuario no proporcionado.");
    }

    const { message } = await destroyProduct(productId);

    if (!message) {
      return res.status(404).json({
        message: "Producto no encontrado o no autorizado",
        success: false,
      });
    }

    res.status(200).json({ message, success: true });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[deleteProduct]", error);
    res.status(statusCode).json({ message, success: false });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const userId = req.user?.userId;

    if (!productId || !userId) {
      throw new Error("ID de producto o usuario no proporcionado.");
    }

    const { message, product } = await updateExistentProduct(productId, req.body);
    res.status(200).json({ message, success: true, data: product });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[updateProduct]", error);
    res.status(statusCode).json({ message, success: false });
  }
};
