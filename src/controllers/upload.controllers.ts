import { Request, Response } from "express";
import { StorageService } from "../modules/storage/StorageService";

const storageService = new StorageService();

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo.", success: false });
    }

    const result = await storageService.uploadImage(req.file, "businesses");

    return res.status(200).json({ url: result.url, publicId: result.publicId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[uploadImage]", error);
    return res.status(500).json({ message, success: false });
  }
};

export const uploadGallery = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No se recibieron archivos.", success: false });
    }

    const results = await storageService.uploadMany(files, "businesses/gallery");

    return res.status(200).json(results.map(r => ({ url: r.url, publicId: r.publicId })));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[uploadGallery]", error);
    return res.status(500).json({ message, success: false });
  }
};
