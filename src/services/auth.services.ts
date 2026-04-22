// Models
import { User } from "../models/user.model";
import RefreshToken from "../models/refreshToken.model";

// Dependencies
import bcrypt from "bcrypt";

// Utils
import { generateToken } from "../utils/jwt";
import { EmailService } from "../modules/notifications/services/EmailService";
import jwt from "jsonwebtoken";
import { addMinutes, addDays } from "date-fns";
import PasswordResetToken from "../models/passwordResetToken";
import { Op } from "sequelize";

export async function loginUserWithEmailAndPassword(
  email: string,
  password: string,
) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado.");

  const isValid = await bcrypt.compare(password, user.getDataValue("password"));
  if (!isValid) throw new Error("Credenciales inválidas.");

  const token = generateToken(
    user.getDataValue("id"),
    user.getDataValue("email"),
    user.getDataValue("role"),
  );

  const refreshTokenValue = crypto.randomUUID();
  await RefreshToken.create({
    user_id: user.getDataValue("id"),
    token: refreshTokenValue,
    expires_at: addDays(new Date(), 7),
  });

  return { token, refreshToken: refreshTokenValue, user };
}

interface IregisterUser {
  name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export async function registerBusinessWithEmailAndPassword(
  registerUser: IregisterUser,
) {
  const emailService = new EmailService();

  const existingUser = await User.findOne({
    where: { email: registerUser.email },
  });
  if (existingUser) {
    throw new Error("Usuario ya existente.");
  }

  const hashedPassword = await bcrypt.hash(registerUser.password, 10);
  if (!hashedPassword) {
    throw new Error("Error al hashear la contraseña.");
  }

  const user = await User.create({
    ...registerUser,
    password: hashedPassword,
  });

  const token = generateToken(
    user.getDataValue("id"),
    user.getDataValue("email"),
    user.getDataValue("role"),
  );

  const refreshTokenValue = crypto.randomUUID();
  await RefreshToken.create({
    user_id: user.getDataValue("id"),
    token: refreshTokenValue,
    expires_at: addDays(new Date(), 7),
  });

  await emailService.sendEmailToValidateBusiness(
    registerUser.email,
    user.getDataValue("id"),
  );

  return { user, token, refreshToken: refreshTokenValue };
}

export const getRoleByuser = async (userId: string) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("Usuario no encontrado.");

  return user.getDataValue("role");
};

export const requestPasswordReset = async (email: string) => {
  try {
    const emailService = new EmailService();
    const user = await User.findOne({ where: { email } });
    if (!user) return { message: "Correo de recuperación enviado." };

    const token = crypto.randomUUID();
    const expired_at = addMinutes(new Date(), 15);

    await PasswordResetToken.create({
      user_id: user.getDataValue("id"),
      token,
      expired_at,
    });

    const resetLinkToken = `/login/reset-password?token=${encodeURIComponent(token)}`;

    await emailService.sendEmailToResetPassword(email, resetLinkToken);
    return { message: "Se ha mandado el link para el cambio de contraseña" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error al cambiar la contraseña : " + error.message);
    } else {
      throw new Error("Error al cambiar la contraseña : " + String(error));
    }
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const emailService = new EmailService();
    const passwordResetToken = await PasswordResetToken.findOne({
      where: { token },
    });
    if (!passwordResetToken) throw new Error("Token no encontrado.");
    if (passwordResetToken.getDataValue("is_used"))
      throw new Error("Este token ya ha sido utilizado.");

    const expiredAt = passwordResetToken.getDataValue("expired_at");
    if (!expiredAt || new Date() > new Date(expiredAt))
      throw new Error("El token ha expirado.");

    const user = await User.findByPk(
      passwordResetToken.getDataValue("user_id"),
    );
    if (!user) throw new Error("Usuario no encontrado.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword },
      { where: { id: user.getDataValue("id") } },
    );

    await passwordResetToken.update({ is_used: true });

    // Revocar todos los refresh tokens del usuario al cambiar contraseña
    await RefreshToken.update(
      { is_revoked: true },
      { where: { user_id: user.getDataValue("id"), is_revoked: false } },
    );

    const toEmail = user.getDataValue("email");
    await emailService.sendEmailToConfirmPasswordUpdate(toEmail);

    return { message: "Contraseña actualizada exitosamente." };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error al cambiar la contraseña : " + error.message);
    } else {
      throw new Error("Error al cambiar la contraseña : " + String(error));
    }
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  const tokenRecord = await RefreshToken.findOne({
    where: { token: refreshToken, is_revoked: false },
    include: [{ model: User, as: "user" }],
  });

  if (!tokenRecord) throw new Error("Refresh token inválido.");

  const expiresAt = tokenRecord.getDataValue("expires_at");
  if (!expiresAt || new Date() > new Date(expiresAt))
    throw new Error("Refresh token expirado.");

  const user = tokenRecord.getDataValue("user");
  const newAccessToken = generateToken(
    user.getDataValue("id"),
    user.getDataValue("email"),
    user.getDataValue("role"),
  );

  return { token: newAccessToken };
};

export const revokeRefreshToken = async (refreshToken: string) => {
  const tokenRecord = await RefreshToken.findOne({
    where: { token: refreshToken },
  });

  if (!tokenRecord) throw new Error("Refresh token no encontrado.");

  await tokenRecord.update({ is_revoked: true });

  return { message: "Sesión cerrada exitosamente." };
};
