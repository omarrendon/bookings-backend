import rateLimit from "express-rate-limit";

export const rateLimiter = (time: number, maxRequests: number) =>
  rateLimit({
    windowMs: time,
    max: maxRequests,
    message: {
      success: false,
      message: `Demasiadas solicitudes desde esta IP, por favor intente nuevamente después de ${time / 60000} minutos.`,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
