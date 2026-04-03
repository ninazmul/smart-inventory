"use server";

import { connectToDatabase } from "../database";
import { handleError } from "../utils";
import Order, { IOrder, IOrderProduct } from "../database/models/order.model";
import Product from "../database/models/product.model";
import { logActivity } from "./activity.actions";

export type OrderProductParams = {
  productId: string;
  quantity: number;
};

export type OrderParams = {
  products: OrderProductParams[];
  name: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  notes?: string;
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
};

// -------------------- CREATE ORDER --------------------
export const createOrder = async (
  tenantId: string,
  data: OrderParams,
): Promise<IOrder | void> => {
  try {
    await connectToDatabase();

    const productIds = data.products.map((p) => p.productId);
    const productsInDb = await Product.find({
      _id: { $in: productIds },
      tenantId,
    });

    const orderProducts: IOrderProduct[] = [];

    for (const p of data.products) {
      const product = productsInDb.find(
        (prod) => prod._id.toString() === p.productId,
      );
      if (!product) throw new Error(`Product not found: ${p.productId}`);
      if (p.quantity > product.stock)
        throw new Error(
          `Only ${product.stock} items available for ${product.title}`,
        );

      orderProducts.push({
        productId: product._id,
        title: product.title,
        image: product.mainImage,
        unitPrice: product.price,
        quantity: p.quantity,
        totalPrice: product.price * p.quantity,
      });

      product.stock -= p.quantity;
      product.isActive = product.stock > 0;
      await product.save();
    }

    const totalPrice = orderProducts.reduce((sum, p) => sum + p.totalPrice, 0);

    const newOrder = await Order.create({
      tenantId,
      products: orderProducts,
      totalPrice,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      notes: data.notes,
      status: data.status || "pending",
    });

    await logActivity(
      tenantId,
      `Order #${newOrder._id.toString()} created by ${data.name}`,
    );

    for (const p of orderProducts) {
      await logActivity(
        tenantId,
        `Stock updated for "${p.title}" — New stock: ${
          productsInDb.find((prod) => prod._id.toString() === p.productId)
            ?.stock
        }`,
      );
    }

    return newOrder;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- GET ALL ORDERS --------------------
export const getAllOrders = async (
  tenantId: string,
): Promise<IOrder[] | void> => {
  try {
    await connectToDatabase();
    return await Order.find({ tenantId }).lean<IOrder[]>().exec();
  } catch (error) {
    handleError(error);
  }
};

// -------------------- GET ORDER BY ID --------------------
export const getOrderById = async (
  tenantId: string,
  orderId: string,
): Promise<IOrder | void> => {
  try {
    await connectToDatabase();
    const order = await Order.findOne({ _id: orderId, tenantId })
      .lean<IOrder>()
      .exec();
    if (!order) throw new Error("Order not found");
    return order;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- UPDATE ORDER --------------------
export const updateOrder = async (
  tenantId: string,
  orderId: string,
  data: Partial<OrderParams>,
): Promise<IOrder | void> => {
  try {
    await connectToDatabase();

    const order = await Order.findOne({ _id: orderId, tenantId });
    if (!order) throw new Error("Order not found");

    let updatedProducts: IOrderProduct[] | undefined;
    let totalPrice: number | undefined;

    if (data.products) {
      // Restore old stock
      for (const oldP of order.products) {
        const product = await Product.findOne({
          _id: oldP.productId,
          tenantId,
        });
        if (product) {
          product.stock += oldP.quantity;
          product.isActive = product.stock > 0;
          await product.save();
        }
      }

      // Process new products
      const productIds = data.products.map((p) => p.productId);
      const productsInDb = await Product.find({
        _id: { $in: productIds },
        tenantId,
      });

      updatedProducts = [];

      for (const p of data.products) {
        const product = productsInDb.find(
          (prod) => prod._id.toString() === p.productId,
        );
        if (!product) throw new Error(`Product not found: ${p.productId}`);
        if (p.quantity > product.stock)
          throw new Error(
            `Only ${product.stock} items available for ${product.title}`,
          );

        updatedProducts.push({
          productId: product._id,
          title: product.title,
          image: product.mainImage,
          unitPrice: product.price,
          quantity: p.quantity,
          totalPrice: product.price * p.quantity,
        });

        product.stock -= p.quantity;
        product.isActive = product.stock > 0;
        await product.save();
      }

      totalPrice = updatedProducts.reduce((sum, p) => sum + p.totalPrice, 0);
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, tenantId },
      {
        ...data,
        ...(updatedProducts && { products: updatedProducts }),
        ...(totalPrice !== undefined && { totalPrice }),
      },
      { new: true },
    )
      .lean<IOrder>()
      .exec();

    if (updatedOrder) {
      await logActivity(
        tenantId,
        `Order #${updatedOrder._id.toString()} updated by system`,
      );
    }

    return updatedOrder ?? undefined;
  } catch (error) {
    handleError(error);
  }
};

// -------------------- DELETE ORDER --------------------
export const deleteOrder = async (
  tenantId: string,
  orderId: string,
): Promise<{ message: string } | void> => {
  try {
    await connectToDatabase();
    const deletedOrder = await Order.findOneAndDelete({
      _id: orderId,
      tenantId,
    });
    if (!deletedOrder) throw new Error("Order not found");

    await logActivity(
      tenantId,
      `Order #${deletedOrder._id.toString()} deleted by system`,
    );

    return { message: "Order deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};
