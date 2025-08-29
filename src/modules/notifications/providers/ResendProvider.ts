// Dependencies
import { Resend } from "resend";
import { IEmailProvider } from "./IEmailProvider";

export class ResendProvider implements IEmailProvider {
  private resend: Resend;
  private from: string;

  constructor(apiKey: string, from: string) {
    this.resend = new Resend(apiKey);
    this.from = from;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html: body,
      });
    } catch (error) {
      throw new Error("Error al enviar el correo: " + error);
    }
  }

  // async sendVerificationEmail(to: string, code: string): Promise<void> {
  //   const subject = "Verifica tu correo electrónico";
  //   const body = `
  //     <h1>Verifica tu correo electrónico</h1>
  //     <p>Tu código de verificación es: <strong>${code}</strong></p>
  //   `;
  //   await this.sendEmail(to, subject, body);
  // };
}
