import { Document, Schema, Types, model, models } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    tenantId: { type: String, required: true },
  },
  { timestamps: true },
);

CategorySchema.index({ tenantId: 1, name: 1 }, { unique: true });

const Category =
  models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
