import React from "react";
import SettingItem, { SettingItemProps } from "./SettingItem";
import ChangePassword from "./ChangePassword";

interface SettingGroupProps{
  title: string;
  settings: SettingItemProps[];
}

const SettingGroup = ({ title, settings }: SettingGroupProps) => {
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
              type={setting.type} // Pass the type for the input (arrow/toggle)
              onToggle={setting.onToggle} // Pass the toggle handler
              isToggled={setting.isToggled} // Pass the toggle state
            >
            <ChangePassword />
            </SettingItem>
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

