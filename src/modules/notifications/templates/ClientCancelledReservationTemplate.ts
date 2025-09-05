// Interfaces
import { IReservationDetails } from "./EmailInterface";
// Utils
import {
  getFormattedHour,
  getFormattedLocalDate,
} from "../../../utils/dateUtils";

export default (reservationDetails: IReservationDetails) => {
  const { businessName, name, startTime } = reservationDetails;

  const formattedDate = getFormattedLocalDate(startTime);
  const formattedTime = getFormattedHour(startTime);

  return `
    <h1>${businessName} - Reservación Cancelada</h1>
    <p>La reservación por parte de ${name} para el ${formattedDate} a las ${formattedTime} ha sido cancelada.</p>
  `;
};
