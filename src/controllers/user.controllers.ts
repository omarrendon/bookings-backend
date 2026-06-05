import { Request, Response } from "express";
import * as userService from "../services/user.services";
import { AppError } from "../utils/AppError";

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "No autorizado.", success: false });
    }
    const { user } = await userService.getMe(userId);
    return res.status(200).json({
      data: user,
      message: "Usuario obtenido exitosamente.",
      success: true,
    });
  } catch (err) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[getMe]", err);
    return res.status(statusCode).json({ message, success: false });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "No autorizado.", success: false });
    }
    const { user } = await userService.updateMe(userId, req.body);
    return res.status(200).json({
      data: user,
      message: "Usuario actualizado exitosamente.",
      success: true,
    });
  } catch (err) {
    const statusCode = err instanceof AppError ? err.statusCode : 400;
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[updateMe]", err);
    return res.status(statusCode).json({ message, success: false });
  }
};
