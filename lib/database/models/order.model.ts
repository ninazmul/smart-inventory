import { Document, Schema, Types, model, models } from "mongoose";

export interface IOrderProduct {
  productId: Types.ObjectId;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  tenantId: string;
  products: IOrderProduct[];
  totalPrice: number;

  // Customer details
  name: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  notes?: string;

  // Order management
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

  createdAt: Date;
  updatedAt: Date;
}

const OrderProductSchema = new Schema<IOrderProduct>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    tenantId: { type: String, required: true },

    products: { type: [OrderProductSchema], required: true },

    totalPrice: { type: Number, required: true },

    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String },
    notes: { type: String },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

OrderSchema.pre("validate", function (next) {
  if (this.products && this.products.length > 0) {
    this.totalPrice = this.products.reduce(
      (sum, p) => sum + p.unitPrice * p.quantity,
      0,
    );
  }
  next();
});

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;
