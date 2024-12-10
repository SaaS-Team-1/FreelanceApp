import React, { useEffect, useState } from "react";
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
  FaWallet,
  FaTable,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useFirestore, useUser } from "@/utils/reactfire";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import { User } from "@/utils/database/schema";
import { collection, getDocs, query, where } from "firebase/firestore";

function Sidebar() {
  const db = useFirestore();
  const [userDb, setUser] = useState<User | null>(null);
  const auth = useAuth();
  const { data: firebaseUser } = useUser(); // Firebase user object
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle the sidebar expanded/collapsed state
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchUser = async () => {
    try {
      if (firebaseUser) {
        const usersRef = collection(db, "users");

        const userQuery = query(
          usersRef,
          where("userId", "==", firebaseUser.uid),
        );

        const userSnapshot = await getDocs(userQuery);

        const userDb = userSnapshot.docs[0]?.data() as User;

        setUser(userDb);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [firebaseUser?.uid]);

  if (!userDb) {
    return <div>Loading...</div>;
  }

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
      {isExpanded && userDb && (
        <div
          className="flex flex-col items-center"
          onClick={() => navigate("/app/profile")}
        >
          <UserProfilePicture
            user={userDb}
            size="large"
            hoverDetails={true}
            rounded
          />
          {/* Align User Level Display and Name */}
          <div className="mt-2 flex flex-row items-center gap-4">
            <h2 className="text-lg font-semibold text-blue-300">
              {userDb.displayName}
            </h2>
          </div>
          <p className="text-xs text-gray-500">{userDb.email}</p>
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
          label="My Posted Gigs"
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
          icon={<FaUser />}
          label="Profile"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/profile"}
          onClick={() => navigate("/app/profile")}
        />
        <SidebarItem
          icon={<FaCog />}
          label="Settings"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/settings"}
          onClick={() => navigate("/app/settings")}
        />
        <SidebarItem
          icon={<FaWallet />}
          label="Wallet"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/wallet"}
          onClick={() => navigate("/app/wallet")}
        />
        <SidebarItem
          icon={<FaTable />}
          label="LeaderBoard"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/leaderBoard"}
          onClick={() => navigate("/app/leaderBoard")}
        />
      </nav>

      <div className="mt-3 border-t border-gray-600 pt-3">
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Logout"
          isExpanded={isExpanded}
          onClick={() => auth.signOut()}
        />
      </div>
    </aside>
  );
}

// SidebarItem Component for each nav item
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isExpanded: boolean;
  onClick?: () => void;
}

function SidebarItem({
  icon,
  label,
  isActive,
  isExpanded,
  onClick,
}: SidebarItemProps) {
  return (
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
}

export default Sidebar;
