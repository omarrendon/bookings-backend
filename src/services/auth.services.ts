import bcrypt from "bcrypt";

import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

export async function loginUserWithEmailAndPassword(
  email: string,
  password: string
) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials.");

  const isValid = await bcrypt.compare(
    password,
    user.getDataValue("passwoord")
  );
  if (!isValid) throw new Error("Invalid credentials.");

  const token = await generateToken(
    user.getDataValue("id"),
    user.getDataValue("role")
  );
  console.log("TOKEN GENERATED : ", token);

  return {
    token,
    user,
  };
}

function generateToken(userId: string, roleId: string): string {
  const secret = process.env.JWT_SECRET || "secret";
  return jwt.sign({ userId, roleId }, secret, { expiresIn: "1d" });
}
