// Models
import { User } from "../models/user.model";

// Dependencies
import bcrypt from "bcrypt";

// Utils
import { generateToken } from "../utils/jwt";
import { EmailService } from "../modules/notifications/services/EmailService";

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

  emailService.sendEmailToValidateBusiness(
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
