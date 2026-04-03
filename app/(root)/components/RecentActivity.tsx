"use client";

import { useEffect, useState } from "react";
import { IActivity } from "@/lib/database/models/activity.model";
import { getRecentActivities } from "@/lib/actions/activity.actions";

type ActivityProps = { tenantId: string };

const RecentActivity = ({ tenantId }: ActivityProps) => {
  const [activities, setActivities] = useState<IActivity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getRecentActivities(tenantId, 10);
      setActivities((data as unknown as IActivity[]) || []);
    };
    fetchActivities();
  }, [tenantId]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/2">
      <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
      <ul className="divide-y divide-gray-200">
        {activities.map((a, idx) => (
          <li key={idx} className="py-2 text-sm">
            <span className="text-gray-400 mr-2">
              {new Date(a.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            — {a.message}
          </li>
        ))}
        {activities.length === 0 && <li>No recent activity</li>}
      </ul>
    </div>
  );
};

export default RecentActivity;
