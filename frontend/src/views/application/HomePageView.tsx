import  {SearchBar} from "@/components/Common/SearchBar";
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
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '1m ago',
      count: 2,
    },
    {
      user: {
        name: "Amina Agile",
        title: "Computer Science Student",
        location: "Leuven City",
        profilePicture: "", // leave blank
      },
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '1m ago',
      count: 2,
    },
    {
      user: {
        name: "Amina Agile",
        title: "Computer Science Student",
        location: "Leuven City",
        profilePicture: "", // leave blank
      },
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '1m ago',
      count: 2,
    },
    {
      user: {
        name: "Amina Agile",
        title: "Computer Science Student",
        location: "Leuven City",
        profilePicture: "", // leave blank
      },
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '1m ago',
      count: 2,
    },
    {
      user: {
        name: "Amina Agile",
        title: "Computer Science Student",
        location: "Leuven City",
        profilePicture: "", // leave blank
      },
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '1m ago',
      count: 2,
    },
  ];
  

  return (
    <div className="flex min-h-[105vh] bg-slate-600">
      {/* Main content area with left padding to prevent overlap */}
      <div className="flex-1 pl-40 p-6 flex flex-col space-y-6">
        {/* Top Section with Search and Notifications */}
        <div className="flex justify-between items-start mb-4">
          {/* Search and Tags Container */}
          <div className="flex flex-col space-y-4 w-full max-w-3xl">
            <SearchBar />
            <div className="flex space-x-4">
              <button className="px-4 py-2 text-sm font-semibold bg-gray-800 text-white rounded-full">
                Computer Science
              </button>
              <button className="px-4 py-2 text-sm font-semibold bg-gray-800 text-white rounded-full">
                Data Engineering
              </button>
              <button className="px-4 py-2 text-sm font-semibold bg-gray-800 text-white rounded-full">
                Machine Learning
              </button>
            </div>
          </div>
  
          <div className="w-80 space-y-6">
            <NotificationList notifications={notifications} />
          </div>
        </div>
  
        {/* Main Content Section */}
        <div className="flex space-x-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Add gig listing here if needed */}
          </div>
  
          <div className="w-80 space-y-6">
            <MyPostedGigListCompressed />
  
            <button className="flex items-center justify-center w-full py-3 text-sm font-semibold bg-orange-500 text-white rounded-full">
              + Upload new gig
            </button>
          </div>
        </div>
  
        <div className="pb-10"></div>
      </div>
    </div>
  );  
}