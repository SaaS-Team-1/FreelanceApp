import React from "react";
import SettingItem from "./SettingItem";

const SettingGroup = ({ title, settings }) => {
  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow-md">
      <h2 className="mb-4 text-lg font-bold text-white">{title}</h2>
      <div className="space-y-2">
        {settings.map((setting, index) => (
          <React.Fragment key={index}>
            <SettingItem
              key={index}
              name={setting.name}
              subtitle={setting.subtitle}
            />
            {index < settings.length - 1 && (
              <hr className="my-4 border-gray-700" /> // Divider between items
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SettingGroup;
