// Models
import { Business } from "../models/business.model";

// Interfaces
import { IBusinessBody } from "../interfaces/businessInterface";
import { getRoleByuser } from "./auth.services";

export const registerBusiness = async (
  businessData: IBusinessBody,
  userId: string | undefined
) => {
  try {
    const userRole = await getRoleByuser(userId as string);
    if (userRole !== "admin" && userRole !== "owner") {
      throw new Error("No tienes permisos para crear un negocio");
    }

    const existingBusiness = await Business.findOne({
      where: {
        name: businessData.name,
        // owner_id: userId, // Ensure the business is unique for the owner
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

export const destroyBusiness = async (
  businessId: string,
  userId: string | undefined
) => {
  try {
    const business = await Business.findOne({
      where: { id: businessId },
    });

    if (!business) {
      throw new Error("Negocio no encontrado o no autorizado.");
    }
    await business.destroy();
    return { message: "Negocio eliminado correctamente." };
  } catch (error) {
    throw new Error(`Error al eliminar negocio: ${error}`);
  }
};

export const updateBusiness = async (
  businessId: string,
  businessData: Partial<IBusinessBody>
) => {
  try {
    const business = await Business.findOne({
      where: { id: businessId },
    });

    if (!business) {
      throw new Error("Negocio no encontrado o no autorizado.");
    }

    const updatedBusiness = await business.update(businessData);
    return { updatedBusiness };
  } catch (error) {
    throw new Error(`Error al actualizar negocio: ${error}`);
  }
};

export const getAllBusinesses = async () => {
  return await Business.findAll();
};

export const getBusinessByUserId = async (userId: string | undefined) => {
  try {
    if (!userId) {
      throw new Error(
        "El ID de usuario es requerido para obtener la información del negocio."
      );
    }
    console.log("Fetching business for user ID: ", userId);
    const business = await Business.findOne({ where: { owner_id: userId } });
    console.log("Business found: ", business);
    return business;
  } catch (error) {
    throw new Error(`Error al obtener negocio: ${error}`);
  }
};
