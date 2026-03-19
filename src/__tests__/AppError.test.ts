import { AppError } from "../utils/AppError";

describe("AppError", () => {
  it("es instancia de Error", () => {
    const err = new AppError("No encontrado.", 404);
    expect(err).toBeInstanceOf(Error);
  });

  it("expone statusCode y message correctamente", () => {
    const err = new AppError("No autorizado.", 403);
    expect(err.message).toBe("No autorizado.");
    expect(err.statusCode).toBe(403);
  });

  it("tiene nombre AppError", () => {
    const err = new AppError("Error.", 400);
    expect(err.name).toBe("AppError");
  });

  it("se puede distinguir de un Error generico", () => {
    const appErr = new AppError("App error", 400);
    const genericErr = new Error("Generic error");

    expect(appErr instanceof AppError).toBe(true);
    expect(genericErr instanceof AppError).toBe(false);
  });
});
