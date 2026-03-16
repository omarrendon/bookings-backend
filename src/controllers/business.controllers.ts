import { Request, Response } from "express";

import * as businessService from "../services/business.services";

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
    return res.status(400).json({ message: `${err}.`, success: false });
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

    return res.status(200).json({
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
    res
      .status(500)
      .json({ message: "Error fetching business", success: false });
  }
};
