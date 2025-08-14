import { Request, Response } from "express";

import * as businessService from "../services/bussines.services";
import { createBussinessSchema } from "../schemas/business.schema";

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { error, value } = createBussinessSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.message, success: false });

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

    const { updatedBusiness } = await businessService.updateBusiness(
      businessId,
      value
    );

    return res.status(200).json({
      data: updatedBusiness,
      message: "Negocio actualizado exitosamente.",
      success: true,
    });
  } catch (err) {
    return res.status(400).json({ message: `${err}.`, success: false });
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
