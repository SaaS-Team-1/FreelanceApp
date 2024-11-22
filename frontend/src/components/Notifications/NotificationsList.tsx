import React from "react";
import { Notification } from "@/utils/database/schema";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList = ({ notifications }: NotificationListProps) => {
  return (
    <div className="scrollbar h-96 max-w-sm overflow-y-scroll rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg">
      <h2 className="sticky top-0 z-10 mb-4 rounded-t-xl bg-gray-800 p-2 text-center text-lg text-white header-bg-extension">
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
            <hr className="my-4 border-gray-700" /> // Divider between items
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NotificationList;
