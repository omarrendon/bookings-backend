import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Formato: Bearer TOKEN

  if (!token) return res.status(401).json({ error: "Token missing" });

  const secret = process.env.JWT_SECRET || "secret";

  try {
    const payload = jwt.verify(token, secret);
    (req as any).user = payload; // Adjuntamos el payload a la request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}
