import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaClipboardList,
  FaComments,
  FaUser,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBars,
  FaWallet,
  FaTable,
  FaPlus,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useFirestore, useUser } from "@/utils/reactfire";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import { User } from "@/utils/database/schema";
import { collection, getDocs, query, where } from "firebase/firestore";
import CreateGigButton from "../Gigs/CreateGigButton";
import { Tooltip } from "flowbite-react";
import { FaCirclePlus } from "react-icons/fa6";

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
      className={`sticky top-0 h-screen ${isExpanded ? "w-fit" : "w-20"
        } fixed flex flex-col justify-between bg-surface-container p-4 text-on-surface transition-all duration-300`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`mb-4 rounded-md text-lg hover:bg-surface-dim ${isExpanded ? "self-end" : "self-center"
          }`}
      >
        <FaBars className="text-primary" />
      </button>

      {/* Profile Section */}
      {isExpanded && userDb && (
        <div
          className="flex flex-col items-center rounded-xl bg-primary-container pt-10 pb-2"
        >
          <UserProfilePicture
            user={userDb}
            size="large"
            hoverDetails={true}
            rounded
          />
          {/* Align User Level Display and Name */}
          <div className="mt-2 flex flex-row items-center gap-4">
            <h2 className="mb-2 text-xl font-bold text-on-primary-container">
              {userDb.displayName}
            </h2>
          </div>
          <p className="text-xs mb-2 text-on-primary-container">{userDb.email}</p>

          <Tooltip content="New Gig">
            <CreateGigButton color="transparent">
              <FaCirclePlus className="text-3xl text-primary" />
            </CreateGigButton>
          </Tooltip>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex w-fit flex-col gap-1">
        <SidebarItem
          icon={<FaHome />}
          label="Home"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app"}
          onClick={() => navigate("/app")}
        />
        <SidebarItem
          icon={<FaTable />}
          label="Leaderboard"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/leaderBoard"}
          onClick={() => navigate("/app/leaderBoard")}
        />

        <div className="my-3 w-full border-t border-primary" />

        <SidebarItem
          icon={<FaClipboardList />}
          label="My Posted Gigs"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/posted-gigs"}
          onClick={() => navigate("/app/posted-gigs")}
        />
        <SidebarItem
          icon={<FaCalendarAlt />}
          label="Schedule"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/schedule"}
          onClick={() => navigate("/app/schedule")}
        />

        <SidebarItem
          icon={<FaComments />}
          label="Chat"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/chat"}
          onClick={() => navigate("/app/chat")}
        />
        <div className="my-3 w-full border-t border-primary" />
        <SidebarItem
          icon={<FaWallet />}
          label="Wallet"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/wallet"}
          onClick={() => navigate("/app/wallet")}
        />

        <SidebarItem
          icon={<FaUser />}
          label="Profile"
          isExpanded={isExpanded}
          isActive={location.pathname === "/app/profile"}
          onClick={() => navigate("/app/profile")}
        />
      </nav>

      <div className="mt-3 border-t border-primary pt-3">
        <SidebarItem
          icon={<FaSignOutAlt />}
          label="Logout"
          isExpanded={isExpanded}
          id="logout-button"
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
  id?: string;
}

function SidebarItem({
  icon,
  label,
  isActive,
  isExpanded,
  onClick,
  id,
}: SidebarItemProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`flex cursor-pointer items-center rounded-lg p-3 text-primary transition-colors duration-200 ${isActive && "bg-surface-dim"
        } ${isExpanded ? "justify-start gap-3" : "justify-center"}
      hover:`}
    >
      <div className={`text-lg`}>{icon}</div>
      {isExpanded && <span className="text-nowrap">{label}</span>}
    </div>
  );
}

export default Sidebar;
