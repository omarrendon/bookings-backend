// Provider
import { EmailProviderFactory } from "../providers/EmailProviderFactory";
// Templates
import registerReservationTemplate from "../templates/BookingRegisterTemplate";
import bookingConfirmationTemplate from "../templates/BookingConfirmationTemplate";
import bookingCancelationTemplate from "../templates/BookingCancelationTemplate";
import newReservationTemplate from "../templates/NewReservationTemplate";
import validateBusinessCountTemplate from "../templates/ValidateBusinessCountTemplate";
import passwordResetTemplate from "../templates/PasswordResetTemplate";
import ConfirmPasswordHasBeenUpdated from "../templates/ConfirmPasswordHasBeenUpdated";

interface IReservationEmailFields {
  to: string;
  toBusiness: string;
  name: string;
  businessName: string;
  reservationId: string | number;
  startTime: string;
  endTime: string;
  products: object[];
}

interface IReservationStatusEmailFields {
  to: string;
  name: string;
  businessName: string;
  startTime: string;
  endTime: string;
  status: string;
  products: object[];
}

export class EmailService {
  private provider;

  constructor() {
    this.provider = EmailProviderFactory.create();
  }

  private async dispatch<T>(
    recipient: string,
    templateFn: (data: T) => { subject: string; bodyTemplate: string },
    data: T,
  ): Promise<void> {
    const { subject, bodyTemplate } = templateFn(data);
    await this.provider.sendEmail(recipient, subject, bodyTemplate);
  }

  public async sendEmailToRegisterReservation(fields: IReservationEmailFields) {
    const { to, ...body } = fields;
    await this.dispatch(to, registerReservationTemplate, body);
  }

  public async sendEmailToConfirmReservation(fields: IReservationStatusEmailFields) {
    const { to, ...body } = fields;
    await this.dispatch(to, bookingConfirmationTemplate, body);
  }

  public async sendEmailToCancelReservation(fields: IReservationStatusEmailFields) {
    const { to, ...body } = fields;
    await this.dispatch(to, bookingCancelationTemplate, body);
  }

  public async sendEmailToNewReservation(fields: IReservationEmailFields) {
    const { toBusiness, ...body } = fields;
    await this.dispatch(toBusiness, newReservationTemplate, body);
  }

  public async sendEmailToValidateBusiness(to: string, userId: string) {
    await this.dispatch(to, validateBusinessCountTemplate, userId);
  }

  public async sendEmailToResetPassword(to: string, resetLinkToken: string) {
    await this.dispatch(to, passwordResetTemplate, resetLinkToken);
  }

  public async sendEmailToConfirmPasswordUpdate(to: string) {
    await this.dispatch(to, ConfirmPasswordHasBeenUpdated, undefined);
  }

  public async sendBussinesCreated(to: string, businessName: string) {
    const subject = `¡Tu negocio "${businessName}" fue creado con éxito!`;
    const bodyTemplate = `
      <h1>¡Felicidades!</h1>
      <p>Tu negocio <strong>${businessName}</strong> ya está registrado en nuestra plataforma.</p>
    `;
    await this.provider.sendEmail(to, subject, bodyTemplate);
  }
}
