// Models
import Business from "../models/business.model";

export const isBusinessOwner = async (
  idField: string,
  userId: string | undefined
) => {
  const responseOwner = {
    success: false,
    message: "",
  };

  const businessOwner = await Business.findOne({
    where: { id: idField, owner_id: userId },
  });
  if (!businessOwner) {
    responseOwner.message = "Negocio no encontrado o no autorizado";
    return responseOwner;
  }

  responseOwner.success = true;
  return responseOwner;
};
