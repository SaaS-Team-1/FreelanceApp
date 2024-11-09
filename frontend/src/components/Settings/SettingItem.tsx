import React from 'react';
import ArrowButton from '../Buttons/ArrowButton';

const SettingItem = ({ name, subtitle }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-600">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">{name}</span>
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
      <ArrowButton />
    </div>
  );
};

export default SettingItem;
