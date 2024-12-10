import React from "react";
import { Notification } from "@/utils/database/schema";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList = ({ notifications }: NotificationListProps) => {
  return (
    <div className="border-300-700 h-96 max-w-sm overflow-y-scroll rounded-xl border bg-white p-6 shadow-lg">
      <h2 className="sticky top-0 z-10 mb-6 rounded-t-xl p-4 text-center text-xl font-semibold text-slate-800">
        Notifications
      </h2>
      {notifications.map((notification, index) => (
        <React.Fragment key={index}>
          <NotificationItem
            key={index}
            notificationMessage={notification.notificationMessage}
            createdAt={notification.createdAt}
          />
          {index < notifications.length - 1 && (
            <hr className="my-4 border-slate-600" /> // Divider between items
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NotificationList;
