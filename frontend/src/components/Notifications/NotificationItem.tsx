import React from "react";
import NotificationText from "./NotificationText";
import { Notification } from "@/utils/database/schema";

const NotificationItem = ({
  notificationMessage,
  createdAt,
}: Omit<Notification, "notificationId" | "userId">) => {
  return (
    <div className="flex items-center gap-4 p-2">
      <div className="flex flex-1 items-center justify-between">
        <NotificationText text={notificationMessage} time={createdAt} />
      </div>
    </div>
  );
};

export default NotificationItem;
