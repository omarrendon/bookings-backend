import { IEmailProvider } from "./IEmailProvider";
import { ResendProvider } from "./ResendProvider";

export class EmailProviderFactory {
  static create(): IEmailProvider {
    const providerName = process.env.EMAIL_PROVIDER || "resend";
    switch (providerName) {
      case "resend":
        return new ResendProvider(
          process.env.RESEND_API_KEY || "",
          process.env.EMAIL_FROM || ""
        );
      // Add more providers here as needed
      default:
        throw new Error(`Email provider ${providerName} not supported.`);
    }
  }
}
