import { SearchBar } from "@/components/Common/SearchBar";
import NotificationList from "@/components/Notifications/NotificationsList";
import MyPostedGigListCompressed from "@/components/Gigs/MyPostedGigListCompressed";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import { Timestamp } from "firebase/firestore";
import { Gig, User } from "@/utils/database/schema";
import { NotificationItemProps } from "@/components/Notifications/NotificationItem";

export default function OverviewView() {
  const notifications:NotificationItemProps[] = [
    {
      user: {
        email: "amina.agile@example.com",
        displayName: "Amina Agile",
        profile: {
          bio: "Computer Science Student in Leuven City.",
          credits: 100,
          picture: "", // Optional: Can remain blank or include a valid URL
          location: "Leuven",
        },
        completedGigs: ["gig1", "gig2"],
        activeGigs: ["gig3"],
        listedGigs: ["gig4", "gig5"],
        averageRating: 4.5,
      },
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "1m ago",
      count: 2,
    },
    {
      user: {
        email: "amina.agile@example.com",
        displayName: "Amina Agile",
        profile: {
          bio: "Computer Science Student in Leuven City.",
          credits: 100,
          picture: "",
          location: "Leuven",
        },
        completedGigs: ["gig1", "gig2"],
        activeGigs: ["gig3"],
        listedGigs: ["gig4", "gig5"],
        averageRating: 4.5,
      },
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "1m ago",
      count: 2,
    },
    {
      user: {
        email: "amina.agile@example.com",
        displayName: "Amina Agile",
        profile: {
          bio: "Computer Science Student in Leuven City.",
          credits: 100,
          picture: "",
          location: "Leuven",
        },
        completedGigs: ["gig1", "gig2"],
        activeGigs: ["gig3"],
        listedGigs: ["gig4", "gig5"],
        averageRating: 4.5,
      },
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "1m ago",
      count: 2,
    },
    {
      user: {
        email: "amina.agile@example.com",
        displayName: "Amina Agile",
        profile: {
          bio: "Computer Science Student in Leuven City.",
          credits: 100,
          picture: "",
          location: "Leuven",
        },
        completedGigs: ["gig1", "gig2"],
        activeGigs: ["gig3"],
        listedGigs: ["gig4", "gig5"],
        averageRating: 4.5,
      },
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "1m ago",
      count: 2,
    },
    {
      user: {
        email: "amina.agile@example.com",
        displayName: "Amina Agile",
        profile: {
          bio: "Computer Science Student in Leuven City.",
          credits: 100,
          picture: "",
          location: "Leuven",
        },
        completedGigs: ["gig1", "gig2"],
        activeGigs: ["gig3"],
        listedGigs: ["gig4", "gig5"],
        averageRating: 4.5,
      },
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      time: "1m ago",
      count: 2,
    },
  ];

  const user:User = {
    email: "amina.agile@example.com",
    displayName: "Amina Agile",
    profile: {
      bio: "Computer Science Student in Leuven City.",
      credits: 100,
      picture: "", // Optional: Can remain blank or include a valid URL
      location: "Leuven"
    },
    completedGigs: ["gig1", "gig2"],
    activeGigs: ["gig3"],
    listedGigs: ["gig4", "gig5"],
    averageRating: 4.5,
  };

  const gigs = [
    {
      title: "Dog Sitter Needed",
      description: "Looking for a reliable dog sitter for my two dogs.",
      category: "Dogsitting",
      price: 50,
      dueDate: Timestamp.now(),
      status: "open" as const,
      listerId: "user1",
      selectedApplicantId: undefined,
      createdAt: Timestamp.now(),
      applicantIds: ["applicant1", "applicant2"],
    },
    {
      title: "Video Editing (7min Video)",
      description: "Edit a 7-minute marketing video for my startup.",
      category: "Video Editing",
      price: 150,
      dueDate: Timestamp.now(),
      status: "in-progress" as const,
      listerId: "user2",
      selectedApplicantId: "applicant3",
      createdAt: Timestamp.now(),
      applicantIds: ["applicant3", "applicant4"],
    },
    {
      title: "Airport Pickup Charleroi",
      description: "Need a ride to Charleroi Airport on 23 November.",
      category: "Transport",
      price: 75,
      dueDate: Timestamp.now(),
      status: "completed" as const,
      listerId: "user3",
      selectedApplicantId: "applicant5",
      createdAt: Timestamp.now(),
      applicantIds: ["applicant5"],
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
            <PostedGigListHome gigs={[]} />
          </div>
        </div>

        <div className="w-120 flex flex-col space-y-6">
          {/* Notifications Container */}
          <NotificationList notifications={notifications} />

          <MyPostedGigListCompressed gigs={gigs} user={user} />

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
  );
}
