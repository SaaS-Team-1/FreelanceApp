import { SearchBar } from "@/components/Common/SearchBar";
import NotificationList from "@/components/Notifications/NotificationsList";
import MyPostedGigListCompressed from "@/components/Gigs/MyPostedGigListCompressed";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import { FaEuroSign } from "react-icons/fa"; // Import the icon for the price badge if needed

export default function OverviewView() {
  const notifications = [
    {
      user: {
        name: "Amina Agile",
        title: "Computer Science Student",
        location: "Leuven City",
        profilePicture: "", // leave blank
      },
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "1m ago",
      count: 2,
    },
    // Add more notifications as needed
  ];

  // Sample data for gigs
  const gigs = [
    {
      title: "Video Editor Needed",
      dateRange: "20 November - 23 November",
      category: { label: "Video Editing" },
      location: { label: "Leuven" },
      price: { label: "60", icon: FaEuroSign }, // Pass icon as IconType
      avatarUrl: "https://via.placeholder.com/40",
      description: "I'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peaceful...",
    },
    {
      title: "Airport Pickup Charleroi",
      dateRange: "23 November",
      category: { label: "Transport" },
      location: { label: "Charleroi" },
      price: { label: "30", icon: FaEuroSign }, // Pass icon as IconType
      avatarUrl: "https://via.placeholder.com/40",
      description: "Need a driver for airport pickup in Charleroi...",
    },
    {
      title: "Chemistry Tutoring",
      dateRange: "25 November",
      category: { label: "Tutoring" },
      location: { label: "Leuven" },
      price: { label: "TBD", icon: FaEuroSign }, // Pass icon as IconType
      avatarUrl: "https://via.placeholder.com/40",
      description: "Looking for an experienced tutor for chemistry lessons...",
    },
  ];

  return (
    <div className="flex flex-1 flex-col space-y-6 p-6">
      {/* Top Section with Search and Notifications */}
      <div className="mb-4 flex items-start justify-between">
        {/* Search and Tags Container */}
        <div className="flex w-full flex-col items-center">
          <SearchBar />
          <div className="flex space-x-4">
            <button className="rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white">
              Computer Science
            </button>
            <button className="rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white">
              Data Engineering
            </button>
            <button className="rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white">
              Machine Learning
            </button>
          </div>
          <div className="p-10">
            <PostedGigListHome gigs={gigs}  showSeeMoreButton={true}/>
          </div>
        </div>

        <div className="w-120 flex flex-col space-y-6">
          {/* Notifications Container */}
          <NotificationList notifications={notifications} />

          <MyPostedGigListCompressed />

          {/* Upload Button */}
          <button className="flex w-full items-center justify-center rounded-full bg-orange-500 py-3 text-sm font-semibold text-white">
            + Upload new gig
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex space-x-6">
        {/* Main Content */}
        <div className="flex-1">{/* Add additional content if needed */}</div>
      </div>

      <div className="pb-10"></div>
    </div>
  );
}
