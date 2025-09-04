import { add, format, parseISO } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

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

export const getFormattedLocalDate = (date: string): string => {
  return format(parseISO(date), "dd 'de' MMMM", { locale: es });
};

export const getFormattedHour = (hour: string): string => {
  return format(parseISO(hour), "HH:mm a");
};

export const getFormattedDateWithTime = (date: string): string => {
  return format(parseISO(date), "dd 'de' MMMM 'a las' HH:mm", { locale: es });
};
