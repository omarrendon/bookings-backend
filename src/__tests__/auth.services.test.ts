// Mock de los modulos externos antes de importar el servicio
jest.mock("../utils/jwt", () => ({
  generateToken: jest.fn(() => "mocked-token"),
  verifyToken: jest.fn(),
}));
jest.mock("../models/user.model", () => ({
  User: { findOne: jest.fn(), findByPk: jest.fn(), create: jest.fn(), update: jest.fn() },
}));
jest.mock("../models/passwordResetToken", () => ({
  __esModule: true,
  default: { findOne: jest.fn(), create: jest.fn() },
}));
jest.mock("../models/refreshToken.model", () => ({
  __esModule: true,
  default: { create: jest.fn() },
}));
jest.mock("../modules/notifications/services/EmailService", () => ({
  EmailService: jest.fn().mockImplementation(() => ({
    sendEmailToResetPassword: jest.fn(),
    sendEmailToConfirmPasswordUpdate: jest.fn(),
    sendEmailToValidateBusiness: jest.fn(),
  })),
}));

import bcrypt from "bcrypt";
import { loginUserWithEmailAndPassword, requestPasswordReset, resetPassword } from "../services/auth.services";
import { User } from "../models/user.model";
import PasswordResetToken from "../models/passwordResetToken";

const mockUser = User as jest.Mocked<typeof User>;
const mockToken = PasswordResetToken as jest.Mocked<typeof PasswordResetToken>;

describe("loginUserWithEmailAndPassword", () => {
  it("lanza error si el usuario no existe", async () => {
    mockUser.findOne.mockResolvedValue(null);
    await expect(loginUserWithEmailAndPassword("x@x.com", "123456")).rejects.toThrow("Usuario no encontrado.");
  });

  it("lanza error si la contraseña es incorrecta", async () => {
    const fakeUser = {
      getDataValue: (key: string) => ({ password: "hashed", id: 1, email: "a@a.com", role: "owner" }[key]),
    };
    mockUser.findOne.mockResolvedValue(fakeUser as any);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

    await expect(loginUserWithEmailAndPassword("a@a.com", "wrong")).rejects.toThrow("Credenciales inválidas.");
  });
});

describe("requestPasswordReset", () => {
  it("retorna mensaje generido si el email no existe (anti-enumeracion)", async () => {
    mockUser.findOne.mockResolvedValue(null);
    const result = await requestPasswordReset("noexiste@x.com");
    expect(result).toEqual({ message: "Correo de recuperación enviado." });
  });
});

describe("resetPassword", () => {
  it("lanza error si el token no existe", async () => {
    mockToken.findOne.mockResolvedValue(null);
    await expect(resetPassword("token-invalido", "nuevapass")).rejects.toThrow();
  });

  it("lanza error si el token ya fue usado", async () => {
    const fakeTokenRecord = {
      getDataValue: (key: string) => (key === "is_used" ? true : key === "expired_at" ? new Date(Date.now() + 999999) : null),
    };
    mockToken.findOne.mockResolvedValue(fakeTokenRecord as any);
    await expect(resetPassword("token-usado", "nuevapass")).rejects.toThrow("Este token ya ha sido utilizado.");
  });

  it("lanza error si el token ha expirado", async () => {
    const expiredDate = new Date(Date.now() - 1000); // ya expiró
    const fakeTokenRecord = {
      getDataValue: (key: string) => (key === "is_used" ? false : key === "expired_at" ? expiredDate : null),
    };
    mockToken.findOne.mockResolvedValue(fakeTokenRecord as any);
    await expect(resetPassword("token-expirado", "nuevapass")).rejects.toThrow("El token ha expirado.");
  });
});
