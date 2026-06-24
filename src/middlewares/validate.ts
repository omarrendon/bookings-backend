import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validateBody = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message, success: false });
    }
    req.body = value;
    next();
  };
};

export const validateQuery = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: error.details[0].message, success: false });
    }
    // req.query es read-only en Express 5 — se muta en lugar de reasignar
    Object.assign(req.query, value);
    next();
  };
};
