// Dependencies
import { Request, Response } from "express";
// Services
import * as scheduleService from "../services/schedule.services";
import { AppError } from "../utils/AppError";

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { newSchedule } = await scheduleService.createSchedule(req.body);

    return res.status(201).json({
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

    if (!date) {
      return res.status(400).json({
        message: "La fecha es requerida.",
        success: false,
      });
    }

    const schedulesBusiness = await scheduleService.getSchedulesByBusiness(
      business_id,
      date as string,
    );

    return res.status(200).json({
      data: schedulesBusiness,
      message: "Horarios obtenidos exitosamente.",
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

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const scheduleId = req.params.id;
    const userId = req.user?.userId;

    if (!scheduleId || !userId) {
      throw new Error("ID de horario o usuario no proporcionado.");
    }

    const { updatedSchedule } = await scheduleService.updateSchedule(
      scheduleId,
      req.body,
    );

    return res.status(200).json({
      data: updatedSchedule,
      message: "Horario actualizado exitosamente.",
      success: true,
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(statusCode).json({
      message: "Error interno del servidor: " + errorMessage,
      success: false,
    });
  }
};

export const getScheduleConfig = async (req: Request, res: Response) => {
  try {
    const { business_id } = req.params;

    const { schedules } = await scheduleService.getScheduleConfig(business_id);

    return res.status(200).json({
      data: schedules,
      message: "Configuración de horarios obtenida exitosamente.",
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
