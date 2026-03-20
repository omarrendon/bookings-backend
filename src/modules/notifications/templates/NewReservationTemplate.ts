// Interfaces
import { IReservationDetails } from "./EmailInterface";
// Utils
import {
  convertUTCDateToLocal,
  getFormattedHour,
  getFormattedLocalDate,
} from "../../../utils/dateUtils";

export default function newReservationTemplate(
  reservationDetails: IReservationDetails
) {
  const {
    startTime,
    endTime,
    businessName,
    name,
    customerEmail,
    reservationId,
    products,
  } = reservationDetails;

  const utcFormattedDate = convertUTCDateToLocal(startTime);
  const reservationDate = getFormattedLocalDate(utcFormattedDate);
  const reservationStartHour = getFormattedHour(utcFormattedDate);
  const reservationEndHour = endTime ? getFormattedHour(convertUTCDateToLocal(endTime)) : null;

  const productsHtml =
    products && products.length > 0
      ? products
          .map((p: any) => `<li>${p.name ?? p.get?.("name") ?? "Producto"}</li>`)
          .join("")
      : "<li>Sin productos especificados</li>";

  const subject = `Nueva reserva en ${businessName} — #${reservationId}`;
  const bodyTemplate = `
    <h2>Nueva reserva recibida</h2>
    <p>Tienes una nueva reserva en <strong>${businessName}</strong>.</p>

    <h3>Detalles del cliente</h3>
    <ul>
      <li><strong>Nombre:</strong> ${name}</li>
      ${customerEmail ? `<li><strong>Email:</strong> ${customerEmail}</li>` : ""}
    </ul>

    <h3>Detalles de la reserva</h3>
    <ul>
      <li><strong>ID:</strong> #${reservationId}</li>
      <li><strong>Fecha:</strong> ${reservationDate}</li>
      <li><strong>Hora de inicio:</strong> ${reservationStartHour}</li>
      ${reservationEndHour ? `<li><strong>Hora de fin:</strong> ${reservationEndHour}</li>` : ""}
    </ul>

    <h3>Servicios solicitados</h3>
    <ul>
      ${productsHtml}
    </ul>
  `;
  return { subject, bodyTemplate };
}
