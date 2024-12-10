import NotificationText from "./NotificationText";
import { Notification } from "@/utils/database/schema";

const NotificationItem = ({
  notificationMessage,
  createdAt,
}: Omit<Notification, "notificationId" | "userId">) => {
  return (
    <div className="flex items-center gap-4 m-2 p-4 rounded-xl bg-surface-container-high">
      <div className="flex flex-1 items-center justify-between">
        <NotificationText text={notificationMessage} time={createdAt} />
      </div>
    </div>
  );
};

export default NotificationItem;
