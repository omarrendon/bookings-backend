import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model";

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

export async function registerUserWithEmailAndPassword(
  name: string,
  email: string,
  password: string,
  role: string = "user"
) {
  const existingUser = await User.findOne({ where: { email } });
  console.log("EXISTING USER : ", existingUser);
  if (existingUser) throw new Error("User already exists.");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return user;
}
