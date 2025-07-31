// Dependencies
import bcrypt from "bcrypt";

// Models
import { Business } from "../models/business.model";

// Interfaces
import { IBusinessBody } from "../interfaces/businessInterface";

export const registerBusinessWithEmailAndPassword = async (
  businessData: IBusinessBody
) => {
  try {
    console.log("Registering business with data:", businessData);
    // const existingBusiness = await Business.findOne({
    //   where: { email: businessData.email },
    // });
    // if (existingBusiness) {
    //   throw new Error("Business already exists.");
    // }
    // const hashedPassword = await bcrypt.hash(businessData.password, 10);
    // businessData.password = hashedPassword;

    const business = await Business.create({
      ...businessData,
    });
    console.log("Business registered successfully:", business);
    return business;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error creating business: " + error.message);
    } else {
      throw new Error("Error creating business: " + String(error));
    }
  }
};

export const getAllBusinesses = async () => {
  return await Business.findAll();
};

export const getBusinessById = async (id: string) => {
  return await Business.findByPk(id);
};
