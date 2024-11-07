import React from 'react';
import SettingItem from './SettingItem';

const SettingGroup = ({ title, settings }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
      <div className="space-y-2">
        {settings.map((setting, index) => (
          <SettingItem
            key={index}
            name={setting.name}
            subtitle={setting.subtitle}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingGroup;
