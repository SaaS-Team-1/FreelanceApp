import React from "react";
import { Notification } from "@/utils/database/schema";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList = ({ notifications }: NotificationListProps) => {
  return (
    <div className="flex h-96 max-w-sm flex-col justify-items-center rounded-xl border bg-surface-container-low">
      <h2 className="py-2 w-full rounded-t-xl bg-primary-container text-center text-2xl font-semibold">
        Notifications
      </h2>
      <div className="scrollbar overflow-y-scroll pl-2">
        {notifications.map((notification, index) => (
          <React.Fragment key={index}>
            <NotificationItem
              key={index}
              notificationMessage={notification.notificationMessage}
              createdAt={notification.createdAt}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
