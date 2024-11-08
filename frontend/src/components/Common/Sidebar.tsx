import React, { useState } from "react";
import { Avatar } from "flowbite-react";
import {
  FaHome,
  FaClipboardList,
  FaComments,
  FaBell,
  FaUser,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";

// Define the user interface
interface User {
  name: string;
  title: string;
  location: string;
  profilePicture: string;
}

interface SidebarProps {
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Toggle the sidebar expanded/collapsed state
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside
      className={`h-screen sticky top-0 ${
        isExpanded ? "w-64" : "w-20"
      } bg-slate-800  text-white flex flex-col justify-between p-4 fixed transition-all duration-300 `}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-white text-lg mb-4 self-end hover:bg-slate-700 p-2 rounded-md"
      >
        <FaBars />
      </button>

      {/* Profile Section */}
      {isExpanded && (
        <div className="flex flex-col items-center">
          <UserProfilePicture user={user} size="large" rounded />
          <h2 className="text-lg font-semibold text-blue-300">{user.name}</h2>
          <p className="text-sm text-gray-400">{user.title}</p>
          <p className="text-xs text-gray-500">{user.location}</p>
          <div className="w-full border-t border-gray-600 my-3" />
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1">
        <SidebarItem icon={<FaHome />} label="Home" isActive={true} isExpanded={isExpanded} />
        <SidebarItem icon={<FaClipboardList />} label="My posted Gigs" isExpanded={isExpanded} />
        <SidebarItem icon={<FaComments />} label="Chat" isExpanded={isExpanded} />
        <SidebarItem icon={<FaCalendarAlt />} label="Schedule" isExpanded={isExpanded} />
        <SidebarItem icon={<FaBell />} label="Notifications" isExpanded={isExpanded} />
        <SidebarItem icon={<FaUser />} label="Profile" isExpanded={isExpanded} />
        <SidebarItem icon={<FaCog />} label="Settings" isExpanded={isExpanded} />
      </nav>

      {/* Logout Section */}
      <div className="border-t border-gray-600 mt-3 pt-3">
        <SidebarItem icon={<FaSignOutAlt />} label="Logout" isExpanded={isExpanded} />
      </div>
    </aside>
  );
};

// SidebarItem Component for each nav item
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isExpanded: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, isExpanded }) => (
  <div
    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive ? "bg-orange-500 text-white" : "text-blue-300"
    } ${isExpanded ? "justify-start gap-3" : "justify-center"}
      hover:bg-blue-500 hover:bg-opacity-20`}
  >
    <div className={`text-lg ${isActive ? "text-white" : "text-blue-300"}`}>{icon}</div>
    {isExpanded && <span>{label}</span>}
  </div>
);

export default Sidebar;
