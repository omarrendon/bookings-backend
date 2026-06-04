import { User } from "../models/user.model";

interface IUpdateUser {
  name?: string;
  last_name?: string;
  email?: string;
}

export const getMe = async (userId: string) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "last_name", "email", "role", "created_at"],
  });

  if (!user) throw new Error("Usuario no encontrado.");

  return { user };
};

export const updateMe = async (userId: string, data: IUpdateUser) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("Usuario no encontrado.");

  if (data.email && data.email !== user.getDataValue("email")) {
    const emailTaken = await User.findOne({ where: { email: data.email } });
    if (emailTaken) throw new Error("El correo electrónico ya está en uso.");
  }

  const updated = await user.update(data);

  return {
    user: {
      id: updated.getDataValue("id"),
      name: updated.getDataValue("name"),
      last_name: updated.getDataValue("last_name"),
      email: updated.getDataValue("email"),
      role: updated.getDataValue("role"),
    },
  };
};
