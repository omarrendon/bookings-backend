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

// PENDING: Implement the rest of the business logic
export const getAllBusinesses = async (_req: Request, res: Response) => {
  try {
    const businesses = await businessService.getAllBusinesses();
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: "Error fetching businesses" });
  }
};

// PENDING: Implement the rest of the business logic
export const getBusinessById = async (req: Request, res: Response) => {
  try {
    const business = await businessService.getBusinessById(req.params.id);
    if (!business) return res.status(404).json({ error: "Business not found" });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: "Error fetching business" });
  }
};
