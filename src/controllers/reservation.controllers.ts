// Dependencies
import { Request, Response } from "express";
// Schemas
import { createReservationSchema } from "../schemas/reservation.schema";
// Services
import * as reservationService from "../services/reservation.services";

export const registerReservation = async (req: Request, res: Response) => {
  try {
    const { error, value } = createReservationSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.message, success: false });

    const validateBusinessProducts =
      await reservationService.validateBusinessProducts(
        value.products,
        value.business_id
      );
    if (!validateBusinessProducts)
      return res.status(400).json({
        message: validateBusinessProducts,
        success: false,
      });

    const reservation = await reservationService.createReservation(req.body);
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

export const getAllReservationsForBusiness = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { business_id } = req.params as {
      business_id: string | string[] | undefined;
    };

    const reservations = await reservationService.getAllReservationsForBusiness(
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

export const updateReservationStatusByBusiness = async (
  req: Request,
  res: Response
) => {
  try {
    const reservationId = req.params.id;
    const user = req.user;

    const updatedReservation = await reservationService.updateStatus(
      reservationId,
      req.body,
      user
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
// PENDING: Implementar la lógica para cancelar una reservación por parte del cliente
export const cancelReservationByCustomer = async (
  req: Request,
  res: Response
) => {
  try {
    const reservationId = req.params.id;
    const userId = req.user?.userId;

    const cancelledReservation =
      await reservationService.cancelReservationByCustomer(
        reservationId,
        userId
      );

    res.status(200).json({
      message: "Reservación cancelada correctamente.",
      data: cancelledReservation,
      success: true,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ message: `Error: ${errorMessage}`, success: false });
  }
};

// export const deleteReservation = async (req: Request, res: Response) => {
//   try {
//     const reservationId = req.params.id;
//     const userId = req.user?.userId;
//     const role = req.user?.role;

//     if (role !== "admin" && role !== "owner") {
//       return res.status(403).json({
//         message: "No tienes permisos para eliminar la reservación.",
//         success: false,
//       });
//     }

//     await reservationService.deleteReservation(reservationId, userId);

//     res.status(200).json({
//       message: "Reservación eliminada correctamente.",
//       success: true,
//     });
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : String(err);
//     res.status(500).json({ error: `Error: ${errorMessage}`, success: false });
//   }
// };
