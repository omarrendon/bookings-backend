import { Request, Response } from "express";
import {
  deleteProductImage,
  getProductImages,
  uploadProductGallery,
  uploadProductImage,
} from "../services/product-image.services";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo.", success: false });
    }

    const image = await uploadProductImage(productId, req.file);

    return res.status(201).json({ success: true, data: image });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[uploadProductImage]", error);
    return res.status(500).json({ message, success: false });
  }
};

export const uploadGallery = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No se recibieron archivos.", success: false });
    }

    const images = await uploadProductGallery(productId, files);

    return res.status(201).json({ success: true, data: images });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[uploadProductGallery]", error);
    return res.status(500).json({ message, success: false });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;

    const result = await deleteProductImage(imageId);

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[deleteProductImage]", error);
    return res.status(500).json({ message, success: false });
  }
};

export const getImages = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const images = await getProductImages(productId);

    return res.status(200).json({ success: true, data: images });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[getProductImages]", error);
    return res.status(500).json({ message, success: false });
  }
};
