// Models
import { Business } from "../models/business.model";

// Interfaces
import { IBusinessBody } from "../interfaces/businessInterface";

export const registerBusinessWithEmailAndPassword = async (
  businessData: IBusinessBody
) => {
  try {
    const existingBusiness = await Business.findOne({
      where: {
        name: businessData.name,
      },
    });
    if (existingBusiness) {
      throw new Error("Negocio ya existente.");
    }

    const business = await Business.create({
      ...businessData,
    });

    return business;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error al crear negocio : " + error.message);
    } else {
      throw new Error("Error al crear negocio : " + String(error));
    }
  }
};

export const getAllBusinesses = async () => {
  return await Business.findAll();
};

export const getBusinessById = async (id: string) => {
  return await Business.findByPk(id);
};
