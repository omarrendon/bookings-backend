// Models
import ProductImage from "../models/product-image.model";
import Product from "../models/product.model";
// Storage
import { StorageService } from "../modules/storage/StorageService";

const storageService = new StorageService();

export const uploadProductImage = async (
  productId: string,
  file: Express.Multer.File
) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Producto no encontrado.");
  }

  const lastImage = await ProductImage.findOne({
    where: { product_id: productId },
    order: [["order", "DESC"]],
  });

  const nextOrder = lastImage ? (lastImage.getDataValue("order") as number) + 1 : 0;

  const { url, publicId } = await storageService.uploadImage(file, "products");

  const image = await ProductImage.create({
    product_id: productId,
    url,
    public_id: publicId,
    order: nextOrder,
  });

  return image;
};

export const uploadProductGallery = async (
  productId: string,
  files: Express.Multer.File[]
) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Producto no encontrado.");
  }

  const lastImage = await ProductImage.findOne({
    where: { product_id: productId },
    order: [["order", "DESC"]],
  });

  let nextOrder = lastImage ? (lastImage.getDataValue("order") as number) + 1 : 0;

  const results = await storageService.uploadMany(files, "products/gallery");

  const images = await ProductImage.bulkCreate(
    results.map(({ url, publicId }) => ({
      product_id: productId,
      url,
      public_id: publicId,
      order: nextOrder++,
    }))
  );

  return images;
};

export const deleteProductImage = async (imageId: string) => {
  const image = await ProductImage.findByPk(imageId);
  if (!image) {
    throw new Error("Imagen no encontrada.");
  }

  await storageService.deleteImage(image.getDataValue("public_id") as string);
  await image.destroy();

  return { message: "Imagen eliminada correctamente." };
};

export const getProductImages = async (productId: string) => {
  const images = await ProductImage.findAll({
    where: { product_id: productId },
    order: [["order", "ASC"]],
  });

  return images;
};
