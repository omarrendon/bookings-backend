// Dependencies
import e, { Request, Response, NextFunction } from "express";
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
  ownerField?: string; // Campo que identifica al dueño (ej: "owner_id")
  resourceIdParam?: string; // Nombre del parámetro o campo donde viene el id (default: "id")
  through?: {
    relationField: string; // Campo en el recurso que apunta al modelo relacionado (ej: "business_id")
    relatedModel: ModelStatic<Model>; // Modelo relacionado (ej: Business)
    relatedOwnerField: string; // Campo en el modelo relacionado que apunta al owner (ej: "owner_id")
  };
}

export function authorizeRoles(roles: string[], config?: OwnershipConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user; // Obtenemos el usuario del request
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          message: "No tienes permisos necesarios para este recurso.",
          success: false,
        });
      }
      if (user.role === "admin") return next();
      //  Si es owner, validar propiedad (solo si se pasó config)

      if (user.role === "owner" && config) {
        const { model, ownerField, resourceIdParam = "id", through } = config;
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

        if (ownerField) {
          if (resource.getDataValue(ownerField) !== user.userId) {
            return res.status(403).json({
              message: "No eres el propietario de este recurso.",
              success: false,
            });
          }
        } else if (through) {
          const relatedId = resource.getDataValue(through.relationField);
          const relatedResource = await through.relatedModel.findByPk(
            relatedId
          );
          if (!relatedResource) {
            return res.status(404).json({
              message: "Recurso relacionado no encontrado.",
              success: false,
            });
          }

          if (
            relatedResource.getDataValue(through.relatedOwnerField) !==
            user.userId
          ) {
            return res.status(403).json({
              message: "No eres el propietario de este recurso.",
              success: false,
            });
          }
        }
      }
      return next();
    } catch (error) {
      return res.status(500).json({
        message:
          "Error interno del servidor." +
          (error instanceof Error ? error.message : ""),
        success: false,
      });
    }
  };
}
