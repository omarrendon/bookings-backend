import type { IStorageProvider, UploadResult } from "./interfaces/IStorageProvider";
import { StorageProviderFactory } from "./StorageProviderFactory";

export class StorageService {
  private provider: IStorageProvider;

  constructor() {
    this.provider = StorageProviderFactory.create();
  }

  uploadImage(file: Express.Multer.File, folder?: string): Promise<UploadResult> {
    return this.provider.upload(file, folder);
  }

  uploadMany(files: Express.Multer.File[], folder?: string): Promise<UploadResult[]> {
    return Promise.all(files.map(file => this.provider.upload(file, folder)));
  }

  deleteImage(publicId: string): Promise<void> {
    return this.provider.delete(publicId);
  }
}
