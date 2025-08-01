//Models
import { Product } from "../models/product.model";
import { Business } from "../models/business.model";
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
