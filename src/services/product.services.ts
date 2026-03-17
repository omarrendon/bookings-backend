//Models
import Product from "../models/product.model";
//Interfaces
import { IProduct } from "../interfaces/product.interfaces";

export const saveProduct = async (product: IProduct) => {
  try {
    const newProduct = await Product.create({
      ...product,
      business_id: product.business_id,
    });
    return { newProduct };
  } catch (error) {
    throw new Error("Failed to save product");
  }
};

export const getAllProducts = async (id: string) => {
  try {
    const products = await Product.findAll({
      where: { business_id: id },
    });
    return products;
  } catch (error) {
    throw new Error("Error al obtener productos");
  }
};

export const destroyProduct = async (productId: string) => {
  try {
    const product = await Product.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Producto no encontrado o no autorizado.");
    }
    await product.destroy();
    return { message: "Producto eliminado correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar producto: ${error}`);
  }
};

export const updateExistentProduct = async (
  productId: string,
  productData: IProduct,
) => {
  try {
    const product = await Product.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Producto no encontrado");
    }
    const updatedProduct = await product.update(productData);
    return {
      message: "Producto actualizado correctamente",
      product: updatedProduct,
    };
  } catch (error) {
    throw new Error(`Error al actualizar producto: ${error}`);
  }
};
