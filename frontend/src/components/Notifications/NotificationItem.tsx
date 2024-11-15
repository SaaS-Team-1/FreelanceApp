import React from "react";
import NotificationText from "./NotificationText";
import NotificationIndicator from "./NotificationIndicator";
import UserProfilePicture from "../Avatar/UserProfilePicture";
import { User } from "@/utils/database/schema";

export interface NotificationBaseProps {
  shape?: string;
  count: number;
}

export interface NotificationItemProps extends NotificationBaseProps {
  user: User;
  text: string;
  time: string;
}

const NotificationItem = ({
  user,
  text,
  time,
  count,
  shape = "circle",
}: NotificationItemProps) => {
  return (
    <div className="flex items-center gap-4 p-2">
      <UserProfilePicture user={user} />
      <div className="flex flex-1 items-center justify-between">
        <NotificationText text={text} time={time} />
        <NotificationIndicator count={count} shape={shape} />
      </div>
    </div>
  );
};

export default NotificationItem;
