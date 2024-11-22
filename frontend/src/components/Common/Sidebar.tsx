// import React, { useState } from "react";
// import {
//   FaHome,
//   FaClipboardList,
//   FaComments,
//   FaBell,
//   FaUser,
//   FaCalendarAlt,
//   FaCog,
//   FaSignOutAlt,
//   FaBars,
// } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
// import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
// import { User } from "@/utils/database/schema";

// // Define the user interface

// interface SidebarProps {
//   user: User;
// }

// const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  

//   const [isExpanded, setIsExpanded] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation(); // Initialize useLocation to get the current path

//   // Toggle the sidebar expanded/collapsed state
//   const toggleSidebar = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <aside
//       className={`sticky top-0 h-screen ${
//         isExpanded ? "w-64" : "w-20"
//       } fixed flex flex-col justify-between bg-slate-800 p-4 text-white transition-all duration-300`}
//       style={{ fontFamily: "Inter, sans-serif" }}
//     >
//       {/* Toggle Button */}
//       <button
//         onClick={toggleSidebar}
//         className="mb-4 self-end rounded-md p-2 text-lg text-white hover:bg-slate-700"
//       >
//         <FaBars />
//       </button>

//       {/* Profile Section */}
//       {isExpanded && (
//         <div className="flex flex-col items-center">
//           <UserProfilePicture user={user} size="large" rounded />
//           <h2 className="text-lg font-semibold text-blue-300">{user.displayName}</h2>
//           <p className="text-xs text-gray-500">{user.profile.location}</p>
//           <div className="my-3 w-full border-t border-gray-600" />
//         </div>
//       )}

//       {/* Navigation Items */}
//       <nav className="flex flex-col gap-1">
//         <SidebarItem
//           icon={<FaHome />}
//           label="Home"
//           isExpanded={isExpanded}
//           isActive={location.pathname === "/app"}
//           onClick={() => navigate("/app")}
//         />
//         <SidebarItem
//           icon={<FaClipboardList />}
//           label="My posted Gigs"
//           isExpanded={isExpanded}
//           isActive={location.pathname === "/app/posted-gigs"}
//           onClick={() => navigate("/app/posted-gigs")}
//         />
//         <SidebarItem
//           icon={<FaComments />}
//           label="Chat"
//           isExpanded={isExpanded}
//           isActive={location.pathname === "/app/chat"}
//           onClick={() => navigate("/app/chat")}
//         />
//         <SidebarItem
//           icon={<FaCalendarAlt />}
//           label="Schedule"
//           isExpanded={isExpanded}
//           isActive={location.pathname === "/app/schedule"}
//           onClick={() => navigate("/app/schedule")}
//         />
//         <SidebarItem
//           icon={<FaBell />}
//           label="Notifications"
//           isExpanded={isExpanded}
//           isActive={location.pathname === "/app/notifications"}
//           onClick={() => navigate("/app/notifications")}
//         />
//         <SidebarItem
//           icon={<FaUser />}
//           label="Profile"
//           isExpanded={isExpanded}
//           isActive={location.pathname === "/app/user/123"}
//           onClick={() => navigate("/app/user/123")}
//         />
//         <SidebarItem
//           icon={<FaCog />}
//           label="Settings"
//           isExpanded={isExpanded}
//           isActive={location.pathname === "/app/settings"}
//           onClick={() => navigate("/app/settings")}
//         />
//       </nav>

//       {/* Logout Section */}
//       <div className="mt-3 border-t border-gray-600 pt-3">
//         <SidebarItem
//           icon={<FaSignOutAlt />}
//           label="Logout"
//           isExpanded={isExpanded}
//           onClick={() => {
//             /* add logout logic here */
//           }}
//         />
//       </div>
//     </aside>
//   );
// };

// // SidebarItem Component for each nav item
// interface SidebarItemProps {
//   icon: React.ReactNode;
//   label: string;
//   isActive?: boolean;
//   isExpanded: boolean;
//   onClick?: () => void;
// }

// const SidebarItem: React.FC<SidebarItemProps> = ({
//   icon,
//   label,
//   isActive,
//   isExpanded,
//   onClick,
// }) => (
//   <div
//     onClick={onClick}
//     className={`flex cursor-pointer items-center rounded-lg p-3 transition-colors duration-200 ${
//       isActive ? "bg-gray-900 text-white" : "text-blue-300"
//     } ${isExpanded ? "justify-start gap-3" : "justify-center"}
//       hover:bg-blue-500 hover:bg-opacity-20`}
//   >
//     <div className={`text-lg ${isActive ? "text-white" : "text-blue-300"}`}>
//       {icon}
//     </div>
//     {isExpanded && <span>{label}</span>}
//   </div>
// );

// export default Sidebar;




import React, { useState } from "react";
import { FaHome, FaClipboardList, FaComments, FaBell, FaUser, FaCalendarAlt, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/utils/reactfire"; 
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch the current authenticated user
  const { data: user } = useUser();

  // Toggle the sidebar expanded/collapsed state
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside
      className={`sticky top-0 h-screen ${
        isExpanded ? "w-64" : "w-20"
      } fixed flex flex-col justify-between bg-slate-800 p-4 text-white transition-all duration-300`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="mb-4 self-end rounded-md p-2 text-lg text-white hover:bg-slate-700"
      >
        <FaBars />
      </button>

      {/* Profile Section */}
      {isExpanded && user && (
        <div className="flex flex-col items-center">
          <UserProfilePicture
            user={{ displayName: user.displayName || "Anonymous", picture: user.photoURL }}
            size="large"
            rounded
          />
          <h2 className="text-lg font-semibold text-blue-300">{user.displayName || "Anonymous"}</h2>
          <p className="text-xs text-gray-500">{user.email}</p>
          <div className="my-3 w-full border-t border-gray-600" />
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1">
        <SidebarItem
          icon={<FaHome />}
          label="Home"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app"}
          onClick={() => navigate("/app")}
        />
        <SidebarItem
          icon={<FaClipboardList />}
          label="My posted Gigs"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/posted-gigs"}
          onClick={() => navigate("/app/posted-gigs")}
        />
        <SidebarItem
          icon={<FaComments />}
          label="Chat"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/chat"}
          onClick={() => navigate("/app/chat")}
        />
        <SidebarItem
          icon={<FaCalendarAlt />}
          label="Schedule"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/schedule"}
          onClick={() => navigate("/app/schedule")}
        />
        <SidebarItem
          icon={<FaBell />}
          label="Notifications"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/notifications"}
          onClick={() => navigate("/app/notifications")}
        />
        <SidebarItem
          icon={<FaUser />}
          label="Profile"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/user/123"}
          onClick={() => navigate("/app/user/123")}
        />
        <SidebarItem
          icon={<FaCog />}
          label="Settings"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/settings"}
          onClick={() => navigate("/app/settings")}
        />
      </nav>

      {/* Logout Section */}
      <div className="mt-3 border-t border-gray-600 pt-3">
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Logout"
          isExpanded={isExpanded}
          onClick={() => {
            // Implement logout logic here
          }}
        />
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
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  isExpanded,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex cursor-pointer items-center rounded-lg p-3 transition-colors duration-200 ${
      isActive ? "bg-gray-900 text-white" : "text-blue-300"
    } ${isExpanded ? "justify-start gap-3" : "justify-center"}
      hover:bg-blue-500 hover:bg-opacity-20`}
  >
    <div className={`text-lg ${isActive ? "text-white" : "text-blue-300"}`}>
      {icon}
    </div>
    {isExpanded && <span>{label}</span>}
  </div>
);

export default Sidebar;
