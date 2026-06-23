// Dependencies
import { Request, Response } from "express";
// Services
import * as reservationService from "../services/reservation.services";
import { AppError } from "../utils/AppError";
import { StorageService } from "../modules/storage/StorageService";

const storageService = new StorageService();

export const registerReservation = async (req: Request, res: Response) => {
  try {
    const reservationData = {
      ...req.body,
      user_id: req.user?.userId ?? undefined,
    };
    const reservation = await reservationService.createReservation(reservationData);
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
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

    const result = await reservationService.getAllReservationsForBusiness(business_id, page, limit);
    res.status(200).json({
      message: "Reservaciones obtenidas correctamente.",
      data: result.reservations,
      meta: { total: result.total, page: result.page, limit: result.limit },
      success: true,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: `Error: ${errorMessage}`, success: false });
  }
};

export const rescheduleReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const updated = await reservationService.rescheduleReservation(id, req.body, user);

    return res.status(200).json({
      message: "Reservación reprogramada y confirmada exitosamente.",
      data: updated,
      success: true,
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Error desconocido";
    return res.status(statusCode).json({ message, success: false });
  }
};

export const uploadProofOfPayment = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo.", success: false });
    }

    const { id } = req.params;
    const uploadedBy = req.user?.userId;

    const { url, publicId } = await storageService.uploadImage(req.file, "reservations/proofs");
    const proof = await reservationService.createReservationProof(id, url, publicId, uploadedBy);

    return res.status(201).json({
      message: "Comprobante de pago subido exitosamente.",
      data: proof,
      success: true,
    });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Error desconocido";
    return res.status(statusCode).json({ message, success: false });
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
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(statusCode).json({ message: errorMessage, success: false });
  }
};
