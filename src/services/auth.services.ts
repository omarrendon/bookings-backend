// Models
import { User } from "../models/user.model";
// Dependencies
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function generateToken(userId: string, roleId: string): string {
  const secret = process.env.JWT_SECRET || "secret";
  return jwt.sign({ userId, roleId }, secret, { expiresIn: "1d" });
}

export async function loginUserWithEmailAndPassword(
  email: string,
  password: string
) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials.");
  console.log("USER FOUND (): ", user);

  const isValid = await bcrypt.compare(password, user.getDataValue("password"));
  if (!isValid) throw new Error("Invalid credentials.");
  console.log("PASSWORD VALIDATED");

  const token = generateToken(
    user.getDataValue("id"),
    user.getDataValue("role")
  );
  console.log("TOKEN GENERATED : ", token);

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
