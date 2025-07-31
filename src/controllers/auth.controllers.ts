import { Request, Response } from "express";

import {
  loginUserWithEmailAndPassword,
  registerUserWithEmailAndPassword,
} from "../services/auth.services";
import { authSchema, registerSchema } from "../schemas/auth.schema";

export async function login(req: Request, res: Response) {
  const { error } = authSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      messageq: error.message,
      success: false,
    });
  }
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUserWithEmailAndPassword(
      email,
      password
    );

    return res.json({
      message: "Usuario ha iniciado sesión exitosamente.",
      data: {
        token,
        user: {
          id: user.getDataValue("id"),
          name: user.getDataValue("name"),
          email: user.getDataValue("email"),
          role: user.getDataValue("role"),
        },
      },
      success: true,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Credenciales inválidas.",
      success: false,
    });
  }
}

export async function signup(req: Request, res: Response) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.message, success: false });

    const user = await registerUserWithEmailAndPassword(value);
    const { id, name, email, role } = user.get({ plain: true });

    return res.status(201).json({
      message: "Usuario ha sido creado exitosamente.",
      data: { id, name, email, role },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: `${err}.`, success: false });
  }
}
