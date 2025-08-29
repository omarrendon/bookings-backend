// Dependencies
import { Request, Response } from "express";
// Services
import * as scheduleService from "../services/schedule.services";
import { createScheduleSchema } from "../schemas/schedule.schema";
// Utils
import { isBusinessOwner } from "../utils/utils";

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const { error, value } = createScheduleSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }

    const businessOwner = await isBusinessOwner(value.business_id, userId);
    if (!businessOwner.success) {
      return res.status(403).json({
        message: businessOwner.message,
        success: false,
      });
    }

    const { hours } = value;
    if (!Array.isArray(hours) || hours.length === 0) {
      return res.status(400).json({
        message: "El arreglo de horas no puede estar vacío.",
        success: false,
      });
    }

    const { newSchedule } = await scheduleService.createSchedule(value);
    if (!newSchedule) {
      return res
        .status(500)
        .json({ message: "Error al crear el horario.", success: false });
    }

    return res.status(200).json({
      data: newSchedule,
      message: "Horario creado exitosamente.",
      success: true,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      message: "Error interno del servidor: " + errorMessage,
      success: false,
    });
  }
};

export const getSchedulesByBusiness = async (req: Request, res: Response) => {
  try {
    const { business_id } = req.params;
    const { date } = req.query;

    if (!business_id) {
      return res
        .status(400)
        .json({ message: "ID del negocio es requerido.", success: false });
    }
    if (!date) {
      return res.status(400).json({
        message: "La fecha es requerida.",
        success: false,
      });
    }

    const schedulesBusiness = await scheduleService.getSchedulesByBusiness(
      business_id,
      date as string
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

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const { error } = createScheduleSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }

    const { hours } = req.body;
    if (!Array.isArray(hours) || hours.length === 0) {
      return res.status(400).json({
        message: "El arreglo de horas no puede estar vacío.",
        success: false,
      });
    }

    const { updatedSchedule } = await scheduleService.updateSchedule(req.body);

    return res.status(200).json({
      data: updatedSchedule,
      message: "Horario actualizado exitosamente.",
      success: true,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      message: "Error interno del servidor: " + errorMessage,
      success: false,
    });
  }
};
