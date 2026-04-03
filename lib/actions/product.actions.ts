"use server";

import { connectToDatabase } from "../database";
import { handleError } from "../utils";
import Product, { IProduct } from "../database/models/product.model";
import { logActivity } from "./activity.actions";

export type ProductParams = {
  title: string;
  mainImage: string;
  category: string;
  price: number;
  wholesalePrice?: number;
  stock?: number;
  minimumStockThreshold?: number;
  isActive?: boolean;
};

// -------------------- CREATE --------------------
export const createProduct = async (tenantId: string, data: ProductParams) => {
  try {
    await connectToDatabase();
    const newProduct = await Product.create({ ...data, tenantId });

    await logActivity(
      tenantId,
      `Product "${newProduct.title}" added to inventory`,
    );

    return JSON.parse(JSON.stringify(newProduct)) as IProduct;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- GET ALL --------------------
export const getAllProducts = async (tenantId: string) => {
  try {
    await connectToDatabase();
    const products = await Product.find({ tenantId }).lean();
    return JSON.parse(JSON.stringify(products)) as IProduct[];
  } catch (error) {
    handleError(error);
  }
};

// -------------------- GET ONLY ACTIVE --------------------
export const getActiveProducts = async (tenantId: string) => {
  try {
    await connectToDatabase();
    const products = await Product.find({ tenantId, isActive: true }).lean();
    return JSON.parse(JSON.stringify(products)) as IProduct[];
  } catch (error) {
    handleError(error);
  }
};

// -------------------- GET BY ID --------------------
export const getProductById = async (tenantId: string, productId: string) => {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ _id: productId, tenantId }).lean();
    if (!product) throw new Error("Product not found");
    return JSON.parse(JSON.stringify(product)) as IProduct;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- UPDATE --------------------
export const updateProduct = async (
  tenantId: string,
  productId: string,
  data: Partial<ProductParams>,
) => {
  try {
    await connectToDatabase();
    const rawUpdatedProduct = await Product.findOneAndUpdate(
      { _id: productId, tenantId },
      data,
      { new: true },
    ).lean();
    if (!rawUpdatedProduct) throw new Error("Product not found");

    const updatedProduct = JSON.parse(
      JSON.stringify(rawUpdatedProduct),
    ) as IProduct;

    await logActivity(
      tenantId,
      `Product "${updatedProduct.title}" updated in inventory`,
    );

    return updatedProduct;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- TOGGLE ACTIVE --------------------
export const toggleProductStatus = async (
  tenantId: string,
  productId: string,
) => {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ _id: productId, tenantId });
    if (!product) throw new Error("Product not found");

    product.isActive = !product.isActive;
    await product.save();

    await logActivity(
      tenantId,
      `Product "${product.title}" status toggled to ${
        product.isActive ? "Active" : "Inactive"
      }`,
    );

    return JSON.parse(JSON.stringify(product)) as IProduct;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- DELETE --------------------
export const deleteProduct = async (tenantId: string, productId: string) => {
  try {
    await connectToDatabase();

    const deletedProduct = await Product.findOneAndDelete({
      _id: productId,
      tenantId,
    }).lean<IProduct | null>();

    if (!deletedProduct) throw new Error("Product not found");

    await logActivity(
      tenantId,
      `Product "${deletedProduct.title}" deleted from inventory`,
    );

    return { message: "Product deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};
