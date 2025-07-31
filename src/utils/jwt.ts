import jwt from "jsonwebtoken";

const SECRT_KEY = process.env.JWT_SECRET || "your-secret-key";

export function generateToken(
  userId: string,
  email: string,
  role: string
): string {
  const secret = SECRT_KEY;
  return jwt.sign({ userId, email, role }, secret, { expiresIn: "10d" });
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRT_KEY);
  } catch (error) {
    return null;
  }
};
