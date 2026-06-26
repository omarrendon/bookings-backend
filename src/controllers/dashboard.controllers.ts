import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import * as dashboardService from "../services/dashboard.services";

export const getBusinessDashboard = async (req: Request, res: Response) => {
  try {
    const { business_id } = req.params;
    const period = (parseInt(req.query.period as string) || 30) as 7 | 30 | 90;

    const data = await dashboardService.getBusinessDashboard(business_id, period);

    res.status(200).json({
      message: "Dashboard obtenido correctamente.",
      data,
      success: true,
    });
  } catch (err) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof Error ? err.message : String(err);
    res.status(statusCode).json({ message, success: false });
  }
};
