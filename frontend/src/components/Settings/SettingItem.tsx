import React, { ReactNode } from 'react';
import ArrowButton from '../Buttons/ArrowButton';

export interface SettingItemProps{
  name: string;
  subtitle: string;
  type: string;
  onToggle?: () => void;
  isToggled?: boolean;
  children?: ReactNode;
}

const SettingItem = ({ name, subtitle, type = 'arrow', onToggle, isToggled, children }: SettingItemProps) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">{name}</span>
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
      {type === 'arrow' && <ArrowButton />}
      {type === 'toggle' && (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isToggled}
            onChange={onToggle}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:bg-blue-600"></div>
          <div
            className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full border border-gray-300 transition-transform peer-checked:translate-x-5"
          ></div>
        </label>
      )}
      {type === 'none' && <div className="w-11 h-6"></div>} 
      {type === 'custom' && children && <div>{children}</div>}
    </div>
  );
};

export default SettingItem;


