import React, { ReactNode } from "react";
import ArrowButton from "../Buttons/ArrowButton";

export interface SettingItemProps {
  name: string;
  subtitle: string;
  type: string;
  onToggle?: () => void;
  isToggled?: boolean;
  children?: ReactNode;
}

const SettingItem = ({
  name,
  subtitle,
  type = "arrow",
  onToggle,
  isToggled,
  children,
}: SettingItemProps) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-slate-800">{name}</span>
        {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
      </div>
      {type === "arrow" && <ArrowButton />}
      {type === "toggle" && (
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isToggled}
            onChange={onToggle}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          <div className="absolute left-1 top-1 size-4 rounded-full border border-gray-300 bg-white transition-transform peer-checked:translate-x-5"></div>
        </label>
      )}
      {type === "none" && <div className="h-6 w-11"></div>}
      {type === "custom" && children && <div>{children}</div>}
    </div>
  );
};

export default SettingItem;
