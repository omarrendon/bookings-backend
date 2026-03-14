import jwt from "jsonwebtoken";

const SECRT_KEY = process.env.JWT_SECRET;
if (!SECRT_KEY) throw new Error("JWT_SECRET no está definido en el .env");

export function generateToken(
  userId: string,
  email: string,
  role: string,
): string {
  const secret = SECRT_KEY;
  return jwt.sign({ userId, email, role }, secret as string, {
    expiresIn: "10d",
  });
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRT_KEY as string) as {
      userId: string;
      email: string;
      role: string;
    };
  } catch (error) {
    throw new Error("Token inválido.");
  }
};
