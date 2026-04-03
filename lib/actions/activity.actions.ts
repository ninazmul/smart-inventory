"use server";

import { connectToDatabase } from "../database";
import Activity, { IActivity } from "../database/models/activity.model";
import { handleError, PlainActivity, sanitizeActivity } from "../utils";

// -------------------- LOG ACTIVITY --------------------
export const logActivity = async (
  tenantId: string,
  message: string,
): Promise<IActivity | void> => {
  try {
    await connectToDatabase();
    const activity = await Activity.create({
      tenantId,
      message,
      timestamp: new Date(),
    });
    return activity.toObject() as IActivity;
  } catch (err) {
    handleError(err);
  }
};

// -------------------- GET RECENT ACTIVITIES --------------------
export const getRecentActivities = async (
  tenantId: string,
  limit = 10,
): Promise<PlainActivity[]> => {
  await connectToDatabase();
  const activities = await Activity.find({ tenantId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();

  return activities.map((a) => sanitizeActivity(a as unknown as IActivity));
};
