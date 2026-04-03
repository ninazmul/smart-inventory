import { Schema, model, models, Document } from "mongoose";

export interface IActivity extends Document {
  tenantId: string;
  message: string;
  timestamp: Date;
}

const ActivitySchema = new Schema<IActivity>({
  tenantId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Activity = models.Activity || model<IActivity>("Activity", ActivitySchema);

export default Activity;