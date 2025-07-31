import { Request, Response } from "express";
import { createBussinessSchema } from "../schemas/auth.schema";
import * as businessService from "../services/bussines.services";

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const { error, value } = createBussinessSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const business = await businessService.registerBusinessWithEmailAndPassword(
      value
    );
    res.status(201).json({
      data: business,
      message: "Negocio creado exitosamente.",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: `${err}.`, success: false });
  }
};

export const getAllBusinesses = async (_req: Request, res: Response) => {
  try {
    const businesses = await businessService.getAllBusinesses();
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: "Error fetching businesses" });
  }
};

export const getBusinessById = async (req: Request, res: Response) => {
  try {
    const business = await businessService.getBusinessById(req.params.id);
    if (!business) return res.status(404).json({ error: "Business not found" });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: "Error fetching business" });
  }
};
