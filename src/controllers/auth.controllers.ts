import { Request, Response } from "express";
import authSchema from "../validators/auth.schema";
import { loginUserWithEmailAndPassword } from "../services/auth.services";

export async function login(req: Request, res: Response) {
  const { error } = authSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  try {
    const { email, passwoord } = req.body;
    const result = await loginUserWithEmailAndPassword(email, passwoord);
    console.log("REPSONSE AUTH --- ");

    return res.json(result);
  } catch (error) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
}
