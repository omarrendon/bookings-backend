// Provider
import { EmailProviderFactory } from "../providers/EmailProviderFactory";
// Templates
import registerReservationTemplate from "../templates/BookingRegisterTemplate";

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

  async sendBussinesCreated(to: string, businessName: string) {
    const subject = `¡Tu negocio "${businessName}" fue creado con éxito!`;
    const html = `
      <h1>¡Felicidades!</h1>
      <p>Tu negocio <strong>${businessName}</strong> ya está registrado en nuestra plataforma.</p>
    `;
    await this.provider.sendEmail(to, subject, html);
  }
}
