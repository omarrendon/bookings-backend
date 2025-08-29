import { EmailProviderFactory } from "../providers/EmailProviderFactory";

export class EmailService {
  private provider;

  constructor() {
    this.provider = EmailProviderFactory.create();
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
