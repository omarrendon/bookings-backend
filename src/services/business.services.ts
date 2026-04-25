// Models
import Business from "../models/business.model";
import { User } from "../models/user.model";
// Interfaces
import { IBusinessBody } from "../interfaces/businessInterface";

export const registerBusiness = async (
  businessData: IBusinessBody,
  userId: string | undefined,
) => {
  console.log(`[BUSINESS] Iniciando creación de negocio para usuario id: ${userId} - nombre: "${businessData.name}"`);
  try {
    const existingBusiness = await Business.findOne({
      where: {
        owner_id: userId,
      },
    });

    if (existingBusiness) {
      console.warn(`[BUSINESS] Creación fallida - el usuario id: ${userId} ya tiene un negocio registrado (id: ${existingBusiness.getDataValue("id")})`);
      throw new Error(
        "Ya tienes un negocio registrado. Solo se permite uno por usuario.",
      );
    }

    const business = await Business.create({
      ...businessData,
      owner_id: userId,
    });
    console.log(`[BUSINESS] Negocio creado exitosamente - id: ${business.getDataValue("id")}, nombre: "${business.getDataValue("name")}", owner_id: ${userId}`);

    return business;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[BUSINESS] Error al crear negocio para usuario id: ${userId} -`, error.message);
      throw new Error("Error al crear negocio : " + error.message);
    } else {
      console.error(`[BUSINESS] Error desconocido al crear negocio para usuario id: ${userId} -`, error);
      throw new Error("Error al crear negocio : " + String(error));
    }
  }
};

export const destroyBusiness = async (businessId: string) => {
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
  businessData: Partial<IBusinessBody>,
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
  const businesses = await Business.findAll({
    include: [
      { model: User, as: "owner", attributes: ["id", "name", "email"] },
    ],
  });
  return { businesses };
};

export const getBusinessById = async (businessId: string) => {
  try {
    const business = await Business.findByPk(businessId, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
    });

    if (!business) {
      throw new Error("Negocio no encontrado.");
    }

    return { business };
  } catch (error) {
    throw new Error(`Error al obtener negocio: ${error}`);
  }
};
