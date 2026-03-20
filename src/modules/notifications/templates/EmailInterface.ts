export interface IReservationDetails {
  startTime: string;
  businessName: string;
  name: string;
  status?: string;
  endTime?: string;
  products?: object[];
  reservationId?: string | number;
  customerEmail?: string;
}
