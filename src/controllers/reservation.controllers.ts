// Dependencies
import { Request, Response } from "express";
// Services
import * as reservationService from "../services/reservation.services";
import { AppError } from "../utils/AppError";

export const registerReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await reservationService.createReservation(req.body);
    res.status(201).json({
      message: "Reservación creada correctamente.",
      data: reservation,
      success: true,
    });
  } catch (err) {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(statusCode).json({ error: errorMessage, success: false });
  }
};

export const getAllReservationsForBusiness = async (
  req: Request,
  res: Response,
) => {
  try {
    const { business_id } = req.params as {
      business_id: string | string[] | undefined;
    };

    const reservations =
      await reservationService.getAllReservationsForBusiness(business_id);
    res.status(200).json({
      message: "Reservaciones obtenidas correctamente.",
      data: reservations,
      success: true,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: `Error: ${errorMessage}`, success: false });
  }
};

export const updateReservationStatusByBusiness = async (
  req: Request,
  res: Response,
) => {
  try {
    const reservationId = req.params.id;
    const user = req.user;

    const updatedReservation = await reservationService.updateStatus(
      reservationId,
      req.body,
      user,
    );

    res.status(200).json({
      message: "Reservación actualizada correctamente.",
      data: updatedReservation,
      success: true,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: `Error: ${errorMessage}`, success: false });
  }
};
