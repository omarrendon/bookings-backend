import { Business } from "../models/business.model";

export const createBusiness = async (data: any) => {
  return await Business.create(data);
};

export const getAllBusinesses = async () => {
  return await Business.findAll();
};

export const getBusinessById = async (id: string) => {
  return await Business.findByPk(id);
};
