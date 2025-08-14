//Models
import Product from "../models/product.model";
import Business from "../models/business.model";
//Interfaces
import { IProduct } from "../interfaces/product.interfaces";

export const saveProduct = async (
  product: IProduct,
  userId: string | undefined
) => {
  try {
    const bussinessOwner = await Business.findOne({
      where: { id: product.business_id, owner_id: userId },
    });
    if (!bussinessOwner) {
      throw new Error("Negocio no encontrado o no autorizado");
    }

    const newProduct = await Product.create({
      ...product,
    });
    return { newProduct };
  } catch (error) {
    console.error("Error saving product:", error);
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

export const destroyProduct = async (
  productId: string,
  userId: string | undefined
) => {
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
  userId: string | undefined,
  productData: IProduct
) => {
  try {
    const bussinessOwner = await Business.findOne({
      where: { id: productData.business_id, owner_id: userId },
    });
    if (!bussinessOwner) {
      throw new Error("Negocio no encontrado o no autorizado");
    }

    const product = await Product.findOne({
      where: { id: productId, business_id: productData.business_id },
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
