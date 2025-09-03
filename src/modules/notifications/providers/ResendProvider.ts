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
}
