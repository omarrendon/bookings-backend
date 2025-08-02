// Model
import { ICategory } from "../interfaces/category.interface";
import { Business } from "../models/business.model";
import { Category } from "../models/category.model";

export async function saveCategory(
  categoryData: ICategory,
  userId: string | undefined
) {
  try {
    const bussinessOwner = await Business.findOne({
      where: { id: categoryData.business_id, owner_id: userId },
    });
    if (!bussinessOwner) {
      throw new Error("Negocio no encontrado o no autorizado");
    }
    const category = await Category.create({ ...categoryData });
    return category;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error al crear negocio : " + error.message);
    } else {
      throw new Error("Error al crear negocio : " + String(error));
    }
  }
}
