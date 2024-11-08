import React from 'react';
import NotificationText from './NotificationText';
import NotificationIndicator from './NotificationIndicator';
import Avatar from "@/components/Avatar/Avatar"; 

const NotificationItem = ({ text, time, count, shape = 'circle' }) => {
  return (
    <div className="flex items-center gap-4 p-2">
      <Avatar />
      <NotificationText text={text} time={time} />
      <NotificationIndicator count={count} shape={shape} />
    </div>
  );
};

export default NotificationItem;
