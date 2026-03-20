import { scheduleCache } from "../utils/scheduleCache";

describe("ScheduleCache", () => {
  beforeEach(() => {
    // Limpiar cache entre tests usando invalidacion universal
    scheduleCache.invalidate("");
  });

  it("retorna null cuando no hay entrada en cache", () => {
    expect(scheduleCache.get("negocio:2026-03")).toBeNull();
  });

  it("retorna el valor guardado antes de que expire", () => {
    const data = { month: new Date(), slots: [] };
    scheduleCache.set("negocio:2026-03", data);
    expect(scheduleCache.get("negocio:2026-03")).toEqual(data);
  });

  it("invalida entradas que coinciden con el prefijo", () => {
    scheduleCache.set("10:2026-03", { slots: [] });
    scheduleCache.set("10:2026-04", { slots: [] });
    scheduleCache.set("20:2026-03", { slots: [] });

    scheduleCache.invalidate("10:");

    expect(scheduleCache.get("10:2026-03")).toBeNull();
    expect(scheduleCache.get("10:2026-04")).toBeNull();
    expect(scheduleCache.get("20:2026-03")).not.toBeNull();
  });

  it("retorna null si el TTL ha expirado", () => {
    jest.useFakeTimers();
    scheduleCache.set("negocio:2026-03", { slots: [] });

    // Avanzar 6 minutos (TTL es 5 min)
    jest.advanceTimersByTime(6 * 60 * 1000);

    expect(scheduleCache.get("negocio:2026-03")).toBeNull();
    jest.useRealTimers();
  });
});
