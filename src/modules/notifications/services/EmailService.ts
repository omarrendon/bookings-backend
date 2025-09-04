// Provider
import { EmailProviderFactory } from "../providers/EmailProviderFactory";
// Templates
import registerReservationTemplate from "../templates/BookingRegisterTemplate";
import bookingConfirmationTemplate from "../templates/BookingConfirmationTemplate";
import bookingCancelationTemplate from "../templates/BookingCancelationTemplate";

export class EmailService {
  private provider;

  constructor() {
    this.provider = EmailProviderFactory.create();
  }

  public async sendEmailToRegisterReservation(emailFieldsInformation: any) {
    const { to, ...body } = emailFieldsInformation;
    const { subject, bodyTemplate } = registerReservationTemplate(body);
    await this.provider.sendEmail(to, subject, bodyTemplate);
  }

  public async sendEmailToConfirmReservation(emailFieldsInformation: any) {
    const { to, ...body } = emailFieldsInformation;
    const { subject, bodyTemplate } = bookingConfirmationTemplate(body);
    await this.provider.sendEmail(to, subject, bodyTemplate);
  }
  public async sendEmailToCancelReservation(emailFieldsInformation: any) {
    const { to, ...body } = emailFieldsInformation;
    const { subject, bodyTemplate } = bookingCancelationTemplate(body);
    await this.provider.sendEmail(to, subject, bodyTemplate);
  }

  async sendBussinesCreated(to: string, businessName: string) {
    const subject = `¡Tu negocio "${businessName}" fue creado con éxito!`;
    const html = `
      <h1>¡Felicidades!</h1>
      <p>Tu negocio <strong>${businessName}</strong> ya está registrado en nuestra plataforma.</p>
    `;
    await this.provider.sendEmail(to, subject, html);
  }
}
