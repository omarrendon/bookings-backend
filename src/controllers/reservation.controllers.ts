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
