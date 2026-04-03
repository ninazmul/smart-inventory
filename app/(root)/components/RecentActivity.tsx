"use client";

import { useEffect, useState } from "react";
import { IActivity } from "@/lib/database/models/activity.model";
import { getRecentActivities } from "@/lib/actions/activity.actions";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

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
    <Card className="p-5 shadow-sm rounded-lg">
      {activities.length === 0 ? (
        <p className="text-gray-500 italic">No recent activity</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {activities.map((a, idx) => (
            <li
              key={idx}
              className="py-3 flex items-center gap-3 hover:bg-gray-50 transition rounded-md px-2"
            >
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500 text-xs">
                {new Date(a.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-gray-700 text-sm">— {a.message}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default RecentActivity;
