// Provider
import { EmailProviderFactory } from "../providers/EmailProviderFactory";
// Templates
import registerReservationTemplate from "../templates/BookingRegisterTemplate";
import bookingConfirmationTemplate from "../templates/BookingConfirmationTemplate";
import bookingCancelationTemplate from "../templates/BookingCancelationTemplate";
import newReservationTemplate from "../templates/NewReservationTemplate";
import createBusinessCountTemplate from "../templates/ValidateBusinessCountTemplate";
import validateBusinessCountTemplate from "../templates/ValidateBusinessCountTemplate";
import passwordResetTemplate from "../templates/PasswordResetTemplate";
import ConfirmPasswordHasBeenUpdated from "../templates/ConfirmPassworHasBeenUpdated";

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

  public async sendEmailToNewReservation(emailFieldsInformation: any) {
    const { toBusiness, ...body } = emailFieldsInformation;
    console.log("Sending email to business:", toBusiness);
    const { subject, bodyTemplate } = newReservationTemplate(body);
    await this.provider.sendEmail(toBusiness, subject, bodyTemplate);
  }

  public async sendEmailToValidateBusiness(to: string, userId: string) {
    const { subject, bodyTemplate } = validateBusinessCountTemplate(userId);
    await this.provider.sendEmail(to, subject, bodyTemplate);
  }

  public async sendEmailToResetPassword(to: string, resetLinkToken: string) {
    const { subject, bodyTemplate } = passwordResetTemplate(resetLinkToken);
    await this.provider.sendEmail(to, subject, bodyTemplate);
  }

  public async sendEmailToConfirmPasswordUpdate(to: string) {
    const { subject, bodyTemplate } = ConfirmPasswordHasBeenUpdated();
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
