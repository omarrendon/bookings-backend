// Dependecies
import { Request, Response } from "express";
// Services
import {
  loginUserWithEmailAndPassword,
  registerBusinessWithEmailAndPassword,
  requestPasswordReset,
  resetPassword,
  refreshAccessToken,
  revokeRefreshToken,
} from "../services/auth.services";
// Schemas
import { authSchema, registerSchema } from "../schemas/auth.schema";

export async function login(req: Request, res: Response) {
  const { error } = authSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
  try {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await loginUserWithEmailAndPassword(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
    });

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

export async function signUpBusiness(req: Request, res: Response) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.message, success: false });

    const user = await registerBusinessWithEmailAndPassword(value);
    const { name, email } = user.get({ plain: true });

    return res.status(201).json({
      message: "Usuario ha sido creado exitosamente.",
      data: { name, email },
      success: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("[signUpBusiness]", err);
    return res.status(500).json({ message, success: false });
  }
}

export async function PasswordReset(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email es requerido.", success: false });
    }
    await requestPasswordReset(email);
    return res
      .status(200)
      .json({ message: "Correo de recuperación enviado.", success: true });
  } catch (error) {
    return res
      .status(200)
      .json({ message: "Correo de recuperación enviado.", success: true });
  }
}

export const passwordUpdated = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token y nueva contraseña son requeridos.",
        success: false,
      });
    }

    const { message } = await resetPassword(token, newPassword);
    if (!message) {
      return res
        .status(404)
        .json({ message: "Token no encontrado.", success: false });
    }
    return res
      .status(200)
      .json({ message: "Contraseña actualizada exitosamente.", success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("[passwordUpdated]", error);
    return res.status(500).json({ message, success: false });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh token requerido.", success: false });
    }

    const { token } = await refreshAccessToken(refreshToken);
    return res.json({ data: { token }, success: true });
  } catch (error) {
    return res
      .status(401)
      .json({ message: `${error}`, success: false });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ message: "Refresh token requerido.", success: false });
    }

    await revokeRefreshToken(refreshToken);
    res.clearCookie("refreshToken");
    return res.json({ message: "Sesión cerrada exitosamente.", success: true });
  } catch (error) {
    return res.status(500).json({ message: `${error}.`, success: false });
  }
};
