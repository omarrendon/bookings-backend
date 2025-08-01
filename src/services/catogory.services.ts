// Model
import { Category } from "../models/category.model";

export async function createCategoryInDB(categoryData: {
  name: string;
  description?: string;
}) {
  try {
    const category = await Category.create({ categoryData });
    return category;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error al crear negocio : " + error.message);
    } else {
      throw new Error("Error al crear negocio : " + String(error));
    }
  }
}
