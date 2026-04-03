import { Document, Schema, Types, model, models } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  mainImage: string;
  category: string;
  price: number;
  wholesalePrice?: number;
  stock: number;
  minimumStockThreshold: number;
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    mainImage: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    wholesalePrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    minimumStockThreshold: { type: Number, required: true, default: 1 },
    isActive: { type: Boolean, default: true },
    tenantId: { type: String, required: true },
  },
  { timestamps: true },
);

ProductSchema.index({ tenantId: 1, title: 1 }, { unique: true });

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
