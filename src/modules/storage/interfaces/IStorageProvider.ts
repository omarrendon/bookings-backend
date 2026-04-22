export interface UploadResult {
  url: string;
  publicId: string;
}

export interface IStorageProvider {
  upload(file: Express.Multer.File, folder?: string): Promise<UploadResult>;
  delete(publicId: string): Promise<void>;
}
