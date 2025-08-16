// Dependencies
import { Request, Response, NextFunction } from "express";
import { Model, ModelStatic } from "sequelize";
import jwt from "jsonwebtoken";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Formato: Bearer TOKEN

  if (!token)
    return res.status(401).json({ error: "Token missing", success: false });

  const secret = process.env.JWT_SECRET || "secret";

  try {
    const payload = jwt.verify(token, secret);
    (req as any).user = payload; // Adjuntamos el payload a la request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

interface OwnershipConfig {
  model: ModelStatic<Model>; // Modelo de Sequelize
  ownerField: string; // Campo que identifica al dueño (ej: "owner_id")
  resourceIdParam?: string; // Nombre del parámetro o campo donde viene el id (default: "id")
}

export function authorizeRoles(roles: string[], config?: OwnershipConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("INICIO : Roles requeridos:", roles);
      const user = (req as any).user; // Obtenemos el usuario del request
      console.log("Usuario autenticado:", user);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          message: "No tienes permisos necesarios para este recurso.",
          success: false,
        });
      }
      if (user.role === "admin") {
        console.log("Usuario es admin, acceso permitido. ****");
        return next();
      }
      //  Si es owner, validar propiedad (solo si se pasó config)
      if (user.role === "owner" && config) {
        const { model, ownerField, resourceIdParam = "id" } = config;
        // Buscar ID en params, body o query
        const resourceId =
          req.params[resourceIdParam] ||
          req.body[resourceIdParam] ||
          req.query[resourceIdParam];

        if (!resourceId) {
          return res.status(400).json({
            message: `ID del recurso (${resourceIdParam}) no fue proporcionado.`,
            success: false,
          });
        }

        // Consultar el recurso
        const resource = await model.findByPk(resourceId);

        if (!resource) {
          return res.status(404).json({
            message: "Recurso no encontrado.",
            success: false,
          });
        }

        // Verificar propiedad
        if (resource.getDataValue(ownerField) !== user.id) {
          return res.status(403).json({
            message: "No eres el propietario de este recurso.",
            success: false,
          });
        }
      }
      return next();
    } catch (error) {
      console.error("Error en la autorización de roles:", error);
      return res.status(500).json({
        message: "Error interno del servidor.",
        success: false,
      });
    }
  };
}
