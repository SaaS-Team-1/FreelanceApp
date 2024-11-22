import React from 'react';
import NotificationText from './NotificationText';
import NotificationIndicator from './NotificationIndicator';
import UserProfilePicture from '../Avatar/UserProfilePicture';

const NotificationItem = ({ user, text, time, count, shape = 'circle' }) => {
  return (
    <div className="flex items-center gap-4 p-2">
      <UserProfilePicture user={user} />
      <div className="flex-1 flex justify-between items-center">
        <NotificationText text={text} time={time} />
        <NotificationIndicator count={count} shape={shape} />
      </div>
    </div>
  );
};

export default NotificationItem;

