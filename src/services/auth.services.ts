// Models
import { User } from "../models/user.model";

// Dependencies
import bcrypt from "bcrypt";

// Utils
import { generateToken } from "../utils/jwt";

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

export async function registerUserWithEmailAndPassword(
  registerUser: IregisterUser
) {
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

  return user;
}
