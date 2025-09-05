// Models
import { User } from "../models/user.model";

// Dependencies
import bcrypt from "bcrypt";

// Utils
import { generateToken } from "../utils/jwt";
import { EmailService } from "../modules/notifications/services/EmailService";
import jwt from "jsonwebtoken";
import { addMinutes } from "date-fns";
import PasswordResetToken from "../models/passwordResetToken";

export async function loginUserWithEmailAndPassword(
  email: string,
  password: string
) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado.");

  const isValid = await bcrypt.compare(password, user.getDataValue("password"));
  if (!isValid) throw new Error("Credenciales inválidas.");

  const token = generateToken(
    user.getDataValue("id"),
    user.getDataValue("email"),
    user.getDataValue("role")
  );

  return {
    token,
    user,
  };
}

interface IregisterUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export async function registerBusinessWithEmailAndPassword(
  registerUser: IregisterUser
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

  await emailService.sendEmailToValidateBusiness(
    registerUser.email,
    user.getDataValue("id")
  );

  return user;
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
    if (!user) throw new Error("Usuario no encontrado.");

    const token = crypto.randomUUID();
    const expiresIn = addMinutes(new Date(), 15);

    await PasswordResetToken.create({
      userId: user.getDataValue("id"),
      token,
      expiresIn,
    });

    const resetLinkToken = `/reset-password?token=${token}`;

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
    if (passwordResetToken.getDataValue("used"))
      throw new Error("Este token ya ha sido utilizado.");

    const user = await User.findByPk(
      passwordResetToken.getDataValue("user_id")
    );
    if (!user) throw new Error("Usuario no encontrado.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword },
      { where: { id: user.getDataValue("id") } }
    );

    await passwordResetToken.update(
      { is_used: true },
      { where: { id: passwordResetToken.getDataValue("id") } }
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
