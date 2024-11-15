import React from "react";
import NotificationItem from "./NotificationItem";

const NotificationList = ({ notifications }) => {
  return (
    <div className="scrollbar h-96 max-w-sm overflow-y-scroll rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-lg">
      <h2 className="sticky top-0 z-10 mb-4 rounded-t-xl bg-gray-900 p-2 text-center text-lg text-white">
        Notifications
      </h2>
      {notifications.map((notification, index) => (
        <>
          <NotificationItem
            key={index}
            user={notification.user}
            text={notification.text}
            time={notification.time}
            count={notification.count}
            shape="circle"
          />
          {index < notifications.length - 1 && (
            <hr className="my-4 border-gray-700" /> // Divider between items
          )}
        </>
      ))}
    </div>
  );
};

export default NotificationList;
