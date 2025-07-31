import { Request, Response } from "express";

import {
  loginUserWithEmailAndPassword,
  registerUserWithEmailAndPassword,
} from "../services/auth.services";
import { authSchema, registerSchema } from "../schemas/auth.schema";

export async function login(req: Request, res: Response) {
  const { error } = authSchema.validate(req.body);
  if (error) {
    console.log("Validation error: ", error.details[0].message);
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  try {
    const { email, password } = req.body;
    console.log("LOGIN REQUEST --- ", email, password);
    const result = await loginUserWithEmailAndPassword(email, password);
    console.log("REPSONSE AUTH --- ", result);

    return res.json(result);
  } catch (error) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
}

export async function signup(req: Request, res: Response) {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { name, email, password, role } = req.body;
    const user = await registerUserWithEmailAndPassword(
      name,
      email,
      password,
      role
    );
    console.log("USER REGISTERED --- ", user);
    return res.status(201).json({ message: "User created", user });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return res.status(400).json({ error: errorMessage });
  }
}
