import { Document, Schema, Types, model, models } from "mongoose";

export interface ICustomer extends Document {
  _id: Types.ObjectId;
  tenantId: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    tenantId: { type: String, required: true },

    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
  },
  { timestamps: true },
);

CustomerSchema.index({ tenantId: 1, phone: 1 }, { unique: true, sparse: true });
CustomerSchema.index({ tenantId: 1, email: 1 }, { unique: true, sparse: true });

const Customer =
  models.Customer || model<ICustomer>("Customer", CustomerSchema);

export default Customer;
