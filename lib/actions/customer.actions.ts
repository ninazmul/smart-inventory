"use server";

import { connectToDatabase } from "../database";
import { handleError } from "../utils";
import Customer, { ICustomer } from "../database/models/customer.model";
import { logActivity } from "./activity.actions";

export type CustomerParams = {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
};

// -------------------- CREATE --------------------
export const createCustomer = async (
  tenantId: string,
  data: CustomerParams,
) => {
  try {
    await connectToDatabase();
    const newCustomer = await Customer.create({ ...data, tenantId });

    await logActivity(
      tenantId,
      `Customer "${newCustomer.name}" created in system`,
    );

    return JSON.parse(JSON.stringify(newCustomer)) as ICustomer;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- GET ALL --------------------
export const getAllCustomers = async (tenantId: string) => {
  try {
    await connectToDatabase();
    const customers = await Customer.find({ tenantId }).lean();
    return JSON.parse(JSON.stringify(customers)) as ICustomer[];
  } catch (error) {
    handleError(error);
  }
};

// -------------------- GET BY ID --------------------
export const getCustomerById = async (tenantId: string, customerId: string) => {
  try {
    await connectToDatabase();
    const customer = await Customer.findOne({
      _id: customerId,
      tenantId,
    }).lean();
    if (!customer) throw new Error("Customer not found");
    return JSON.parse(JSON.stringify(customer)) as ICustomer;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- UPDATE --------------------
export const updateCustomer = async (
  tenantId: string,
  customerId: string,
  data: Partial<CustomerParams>,
) => {
  try {
    await connectToDatabase();
    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: customerId, tenantId },
      data,
      { new: true },
    ).lean<ICustomer | null>();

    if (!updatedCustomer) throw new Error("Customer not found");

    await logActivity(
      tenantId,
      `Customer "${updatedCustomer.name}" updated in system`,
    );

    return updatedCustomer;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- DELETE --------------------
export const deleteCustomer = async (tenantId: string, customerId: string) => {
  try {
    await connectToDatabase();

    const deletedCustomer = await Customer.findOneAndDelete({
      _id: customerId,
      tenantId,
    }).lean<ICustomer | null>();

    if (!deletedCustomer) throw new Error("Customer not found");

    await logActivity(
      tenantId,
      `Customer "${deletedCustomer.name}" deleted from system`,
    );

    return { message: "Customer deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};
