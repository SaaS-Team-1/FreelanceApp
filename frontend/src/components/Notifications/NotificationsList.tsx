import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications }) => {
  return (
    <div className="max-w-sm bg-gray-900 p-4 rounded-xl shadow-lg">
      <h2 className="text-white text-lg mb-4 text-center">Notifications</h2>
      {notifications.map((notification, index) => (
        <NotificationItem
          key={index}
          user={notification.user}
          text={notification.text}
          time={notification.time}
          count={notification.count}
          shape="circle" // Set to "square" if you want square indicators
        />
      ))}
    </div>
  );
};

export default NotificationList;
