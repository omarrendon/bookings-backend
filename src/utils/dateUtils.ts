import { add } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

/**
   * Convierte una fecha en zona local → UTC (para guardar en BD)
   *  date fecha como string o Date
  //   tz zona horaria (ej: "America/Mexico_City")
   */

export const convertDateToUTC = (
  date: string | Date,
  tz: string = "America/Mexico_City"
): Date => {
  const zonedDate = fromZonedTime(date, tz);
  return zonedDate;
};

export const convertUTCDateToLocal = (
  date: string | Date,
  tz: string = "America/Mexico_City"
) => {
  return formatInTimeZone(date, tz, "yyyy-MM-dd'T'HH:mm:ss");
};

export const addMinutesToDate = (date: Date, minutes: number): Date => {
  return add(date, { minutes });
};
