// Dependencies
import { Request, Response } from "express";
// Schemas
import { createReservationSchema } from "../schemas/reservation.schema";
// Services
import * as reservationService from "../services/reservation.services";

export const registerReservation = async (req: Request, res: Response) => {
  try {
    console.log("Registering reservation: ", req.body);
    const userId = req.user?.userId;
    const { error, value } = createReservationSchema.validate(req.body);

    if (error)
      return res.status(400).json({ message: error.message, success: false });

    const reservation = await reservationService.createReservation(
      value,
      userId
    );
    res.status(201).json({
      message: "Reservación creada correctamente.",
      data: reservation,
      success: true,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: `Error: ${errorMessage}`, success: false });
  }
};

export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const business_id = req.query.business_id as string | string[] | undefined;

    // console.log("User : ", businessId);
    console.log("Init getAllReservations with role: ", role);
    if (role !== "admin" && role !== "owner") {
      return res.status(403).json({
        message: "No tienes permisos para ver las reservaciones.",
        success: false,
      });
    }

    const reservations = await reservationService.getAllReservations(
      userId,
      role,
      business_id
    );
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
