import React from 'react';

const NotificationText = ({ text, time }) => {
  return (
    <div className="flex flex-col">
      <p className="text-sm text-white">{text}</p>
      <span className="text-xs text-blue-500">{time}</span>
    </div>
  );
};

export default NotificationText;
