import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export interface IReservationDetails {
  date: string;
  time: string;
  name: string;
}

export default function registerReservationTemplate(reservationDetails: any): {
  subject: string;
  bodyTemplate: string;
} {
  const { startTime, name, businessName } = reservationDetails;
  const reservationDate = format(parseISO(startTime), "dd 'de' MMMM", {
    locale: es,
  });
  const reservationHour = format(parseISO(startTime), "HH:mm a");

  const subject = `¡Hola, ${name}! tu reserva se ha realizado con éxito`;
  const bodyTemplate = `
      <h1>Registro de Reserva</h1>
      <p>Gracias por registrarte en ${businessName} para una reserva con nosotros. Aquí están los detalles de tu reserva:</p>
      <ul>
        <li>Fecha: ${reservationDate}</li>
        <li>Hora: ${reservationHour}</li>
        <li>Nombre: ${name}</li>
      </ul>
    `;
  return {
    subject,
    bodyTemplate,
  };
}
