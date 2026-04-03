"use server";

import { connectToDatabase } from "../database";
import { handleError } from "../utils";
import Category, { ICategory } from "../database/models/category.model";
import { logActivity } from "./activity.actions";

export type CategoryParams = {
  name: string;
};

// -------------------- CREATE --------------------
export const createCategory = async (
  tenantId: string,
  data: CategoryParams,
) => {
  try {
    await connectToDatabase();
    const newCategory = await Category.create({ ...data, tenantId });

    await logActivity(
      tenantId,
      `Category "${newCategory.name}" created in system`,
    );

    return JSON.parse(JSON.stringify(newCategory)) as ICategory;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- GET ALL --------------------
export const getAllCategories = async (tenantId: string) => {
  try {
    await connectToDatabase();
    const categories = await Category.find({ tenantId }).lean();
    return JSON.parse(JSON.stringify(categories)) as ICategory[];
  } catch (error) {
    handleError(error);
  }
};

// -------------------- GET BY ID --------------------
export const getCategoryById = async (tenantId: string, categoryId: string) => {
  try {
    await connectToDatabase();
    const category = await Category.findOne({
      _id: categoryId,
      tenantId,
    }).lean();
    if (!category) throw new Error("Category not found");
    return JSON.parse(JSON.stringify(category)) as ICategory;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- DELETE --------------------
export const deleteCategory = async (tenantId: string, categoryId: string) => {
  try {
    await connectToDatabase();
    const deletedCategory = await Category.findOneAndDelete({
      _id: categoryId,
      tenantId,
    }).lean<ICategory | null>();

    if (!deletedCategory) throw new Error("Category not found");

    await logActivity(
      tenantId,
      `Category "${deletedCategory.name}" deleted from system`,
    );

    return { message: "Category deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};
