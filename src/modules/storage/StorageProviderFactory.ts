import type { IStorageProvider } from "./interfaces/IStorageProvider";
import { CloudinaryStorageProvider } from "./providers/CloudinaryStorageProvider";

export class StorageProviderFactory {
  static create(): IStorageProvider {
    const provider = process.env.STORAGE_PROVIDER || "cloudinary";

    switch (provider) {
      case "cloudinary":
        return new CloudinaryStorageProvider(
          process.env.CLOUDINARY_CLOUD_NAME ?? "",
          process.env.CLOUDINARY_API_KEY ?? "",
          process.env.CLOUDINARY_API_SECRET ?? "",
        );
      // Para agregar un nuevo proveedor:
      // case "s3":
      //   return new S3StorageProvider(...);
      default:
        throw new Error(`Storage provider "${provider}" not supported.`);
    }
  }
}
