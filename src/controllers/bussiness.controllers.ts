import { Request, Response } from "express";

import * as businessService from "../services/bussines.services";
import { createBussinessSchema } from "../schemas/business.schema";
import { getRoleByuser } from "../services/auth.services";

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { error, value } = createBussinessSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.message, success: false });

    const userRole = await getRoleByuser(userId as string);

    if (userRole !== "admin" && userRole !== "owner") {
      return res.status(403).json({
        message: "No tienes permisos para crear un negocio.",
        success: false,
      });
    }

    const business = await businessService.registerBusiness(value, userId);
    res.status(201).json({
      data: business,
      message: "Negocio creado exitosamente.",
      success: true,
    });
  } catch (err) {
    return res.status(400).json({ message: `${err}.`, success: false });
  }
};

export const deleteBusiness = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const businessId = req.params.id;

    if (!businessId)
      return res
        .status(400)
        .json({ message: "Id de negocio es requerido.", success: false });

    const { message } = await businessService.destroyBusiness(
      businessId,
      userId
    );

    return res.status(204).json({
      message,
      success: true,
    });
  } catch (err) {
    return res.status(400).json({ message: `${err}.`, success: false });
  }
};

export const updateBusiness = async (req: Request, res: Response) => {
  try {
    const businessId = req.params.id;
    const businessData = req.body;

    if (!businessId)
      return res
        .status(400)
        .json({ message: "Id de negocio es requerido.", success: false });

    const { error, value } = createBussinessSchema.validate(businessData);
    if (error)
      return res.status(400).json({ message: error.message, success: false });

    const updateResult = await businessService.updateBusiness(
      businessId,
      value
    );

    if (!updateResult) {
      return res.status(404).json({
        message: "Negocio no encontrado o no autorizadomiomioomik.",
        success: false,
      });
    }
    return res.status(200).json({
      data: updateResult,
      message: "Negocio actualizado exitosamente.",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: `${err}.`, success: false });
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
    res
      .status(500)
      .json({ message: "Error fetching businesses", success: false });
  }
};

// PENDING: Implement the rest of the business logic
export const getBusinessById = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ message: "Id de negocio es requerido.", success: false });
    }
    const { business } = await businessService.getBusinessByUserId(
      req.params.id
    );
    res.status(200).json({
      data: business,
      message: "Negocio obtenido exitosamente.",
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching business", success: false });
  }
};
