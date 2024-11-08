import { SearchBar } from "@/components/Common/SearchBar";
import NotificationList from "@/components/Notifications/NotificationsList";
import MyPostedGigListCompressed from "@/components/Gigs/MyPostedGigListCompressed";

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
  ];

  return (
    <div className="flex min-h-[105vh] w-full bg-slate-600">
      {/* Main content area with left padding to prevent overlap */}
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Top Section with Search and Notifications */}
        <div className="mb-4 flex items-start justify-between">
          {/* Search and Tags Container */}
          <div className="flex w-full flex-col items-center ">
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
          </div>

          <div className="flex w-120 flex-col space-y-6">
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
          <div className="flex-1">{/* Add gig listing here if needed */}</div>

          {/* Right Sidebar with Posted Gigs and Upload Button */}
        </div>

        <div className="pb-10"></div>
      </div>
    </div>
  );
}
