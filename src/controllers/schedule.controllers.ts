// Dependencies
import { Request, Response } from "express";
// Services
import * as scheduleService from "../services/schedule.services";

export const getSchedulesByBusiness = async (req: Request, res: Response) => {
  try {
    const { business_id } = req.params;
    if (!business_id) {
      return res
        .status(400)
        .json({ message: "ID del negocio es requerido.", success: false });
    }

    const { schedulesBusiness } = await scheduleService.getSchedulesByBusiness(
      business_id
    );
    return res.status(200).json({
      data: schedulesBusiness,
      message: "Horarios obtenidos exitosamente.",
      success: true,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      message: "Internal server error: " + errorMessage,
      success: false,
    });
  }
};
