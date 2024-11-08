import { FC } from 'react';
import { FaHome, FaFolder, FaCog } from 'react-icons/fa';

const Sidebar: FC = () => {
  return (
    <aside className="w-64 h-full bg-gray-100 dark:bg-gray-800 p-4">
      <ul className="space-y-4 text-gray-600 dark:text-gray-300">
        <li>
          <button className="flex items-center space-x-3 hover:text-blue-600">
            <FaHome className="text-xl" />
            <span>Home</span>
          </button>
        </li>
        <li>
          <button className="flex items-center space-x-3 hover:text-blue-600">
            <FaFolder className="text-xl" />
            <span>Files</span>
          </button>
        </li>
        <li>
          <button className="flex items-center space-x-3 hover:text-blue-600">
            <FaCog className="text-xl" />
            <span>Settings</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
