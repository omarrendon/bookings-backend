import { Request, Response } from "express";

import * as businessService from "../services/business.services";
import { AppError } from "../utils/AppError";

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const business = await businessService.registerBusiness(req.body, userId);
    res.status(201).json({
      data: business,
      message: "Negocio creado exitosamente.",
      success: true,
    });
  } catch (err) {
    const statusCode = err instanceof AppError ? err.statusCode : 400;
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[createBusiness]", err);
    return res.status(statusCode).json({ message, success: false });
  }
};

export const deleteBusiness = async (req: Request, res: Response) => {
  try {
    const businessId = req.params.id;

    if (!businessId)
      return res
        .status(400)
        .json({ message: "Id de negocio es requerido.", success: false });

    const { message } = await businessService.destroyBusiness(businessId);

    return res.status(200).json({ message, success: true });
  } catch (err) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[deleteBusiness]", err);
    return res.status(statusCode).json({ message, success: false });
  }
};

export const updateBusiness = async (req: Request, res: Response) => {
  try {
    const businessId = req.params.id;

    if (!businessId)
      return res
        .status(400)
        .json({ message: "Id de negocio es requerido.", success: false });

    const updateResult = await businessService.updateBusiness(
      businessId,
      req.body,
    );

    if (!updateResult) {
      return res.status(404).json({
        message: "Negocio no encontrado o no autorizado.",
        success: false,
      });
    }
    return res.status(200).json({
      data: updateResult,
      message: "Negocio actualizado exitosamente.",
      success: true,
    });
  } catch (err) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[updateBusiness]", err);
    return res.status(statusCode).json({ message, success: false });
  }
};

export const getAllBusinesses = async (_req: Request, res: Response) => {
  try {
    const { businesses } = await businessService.getAllBusinesses();
    return res.status(200).json({
      data: businesses,
      message: "Negocios obtenidos exitosamente.",
      success: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[getAllBusinesses]", err);
    res.status(500).json({ message, success: false });
  }
};

export const getBusinessById = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "Id de negocio es requerido.", success: false });
    }
    const { business } = await businessService.getBusinessById(req.params.id);
    res.status(200).json({
      data: business,
      message: "Negocio obtenido exitosamente.",
      success: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[getBusinessById]", err);
    res.status(500).json({ message, success: false });
  }
};
