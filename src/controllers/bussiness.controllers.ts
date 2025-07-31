import { Request, Response } from "express";
import { createBussinessSchema } from "../schemas/auth.schema";
import * as businessService from "../services/bussines.services";

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const { error, value } = createBussinessSchema.validate(req.body);
    console.log("INIT CREATE BUSINESS REQUEST --- ");
    if (error) return res.status(400).json({ error: error.message });
    console.log("Validation error: ", error);

    const business = await businessService.registerBusinessWithEmailAndPassword(
      value
    );
    res.status(201).json(business);
  } catch (err) {
    res.status(500).json({ error: "Error creating business", details: err });
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
