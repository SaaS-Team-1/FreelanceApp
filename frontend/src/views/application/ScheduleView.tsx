import React, { useState } from "react";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import GigDetails from "@/components/Gigs/GigDetails"; // Import GigDetails component
import { Gig, User } from "@/utils/database/schema";
import { Timestamp } from "firebase/firestore";
import Calendar from "@/components/Calendar/Calendar";
import CustomButton from "@/components/Buttons/CustomButton";

function ScheduleView() {
  const currentUserId = "user1";

  const [selectedGig, setSelectedGig] = useState<Gig | null>(null); // State to hold the selected gig
  const [isGigDetailsOpen, setIsGigDetailsOpen] = useState(false); // State to control modal visibility

  const users: User[] = [
    {
      userId: "user1",
      email: "amina.agile@example.com",
      displayName: "Amina Agile",
      profile: {
        bio: "Computer Science Student in Leuven City.",
        credits: 100,
        picture: "https://via.placeholder.com/40",
        location: "Leuven",
      },
      completedGigs: ["gig4"],
      activeGigs: ["gig1", "gig5", "gig3"],
      listedGigs: ["gig2"],
      averageRating: 4.5,
    },
    {
      userId: "user2",
      email: "john.doe@example.com",
      displayName: "John Doe",
      profile: {
        bio: "Freelance photographer based in Antwerp.",
        credits: 150,
        picture: "https://via.placeholder.com/40",
        location: "Antwerp",
      },
      completedGigs: ["gig2"],
      activeGigs: [],
      listedGigs: ["gig3"],
      averageRating: 4.7,
    },
    {
      userId: "user3",
      email: "applicant.one@example.com",
      displayName: "Alice Applicant",
      profile: {
        bio: "Freelance graphic designer.",
        credits: 80,
        picture: "https://via.placeholder.com/40",
        location: "Brussels",
      },
      completedGigs: [],
      activeGigs: [],
      listedGigs: [],
      averageRating: 4.2,
    },
  ];

  const gigs: Gig[] = [
    {
      gigId: "gig1",
      title: "Video Editor Needed",
      description:
        "Looking for a creative video editor to produce a short 10-20 second intro for a project.",
      category: "Video Editing",
      price: 80,
      dueDate: Timestamp.fromDate(new Date(2025, 2, 10)),
      status: "in-progress",
      listerId: "user2",
      selectedApplicantId: "user1",
      createdAt: Timestamp.now(),
      location: "Remote",
      applicantIds: ["user1", "user3"],
    },
    {
      gigId: "gig2",
      title: "Looking for a Photographer",
      description:
        "Need a photographer to take a professional photo for my LinkedIn profile.",
      category: "Photography",
      price: 50,
      dueDate: Timestamp.fromDate(new Date(2025, 2, 19)), // March 19, 2025
      status: "completed",
      listerId: "user1",
      selectedApplicantId: "user3",
      createdAt: Timestamp.now(),
      location: "Antwerp",
      applicantIds: ["user3"],
    },
    {
      gigId: "gig3",
      title: "Chemistry Tutor Needed",
      description:
        "Looking for a chemistry tutor for 1-on-1 sessions for exam preparation.",
      category: "Tutoring",
      price: 0,
      dueDate: Timestamp.fromDate(new Date(2025, 4, 25)), // May 25, 2025
      status: "in-progress",
      listerId: "user2",
      selectedApplicantId: "user1", // User 1 is working on this gig
      createdAt: Timestamp.now(),
      location: "Leuven",
      applicantIds: ["user1", "user3"],
    },
    {
      gigId: "gig4",
      title: "Logo Design for Startup",
      description:
        "Need a logo for a tech startup. Deliverables include vector files and branding guidelines.",
      category: "Graphic Design",
      price: 150,
      dueDate: Timestamp.fromDate(new Date(2025, 2, 28)), // March 28, 2025
      status: "completed",
      listerId: "user3",
      selectedApplicantId: "user1",
      createdAt: Timestamp.now(),
      location: "Brussels",
      applicantIds: ["user1"],
    },
    {
      gigId: "gig5",
      title: "Website Development",
      description:
        "Build a responsive website for a local business, including design and deployment.",
      category: "Web Development",
      price: 500,
      dueDate: Timestamp.fromDate(new Date(2025, 2, 25)), // March 25, 2025
      status: "in-progress",
      listerId: "user2",
      selectedApplicantId: "user1",
      createdAt: Timestamp.now(),
      location: "Remote",
      applicantIds: ["user1"],
    },
    {
      gigId: "gig6",
      title: "Website Dev",
      description:
        "Build a responsive website for a local business, including design and deployment.",
      category: "Web Development",
      price: 500,
      dueDate: Timestamp.fromDate(new Date(2025, 2, 15)), // March 15, 2025
      status: "open",
      listerId: "user2",
      selectedApplicantId: undefined,
      createdAt: Timestamp.now(),
      location: "Remote",
      applicantIds: ["user1"],
    },
  ];

  const currentUser = users.find((user) => user.userId === currentUserId);

  const scheduledGigs = gigs.filter(
    (gig) =>
      currentUser?.activeGigs.includes(gig.gigId) &&
      gig.selectedApplicantId === currentUserId &&
      gig.status === "in-progress"
  );

  const pendingGigs = gigs.filter(
    (gig) =>
      gig.applicantIds.includes(currentUserId) &&
      (!gig.selectedApplicantId || gig.selectedApplicantId === undefined)
  );

  const handleSeeMoreClick = (gig: Gig) => {
    setSelectedGig(gig);
    setIsGigDetailsOpen(true);
  };

  const handleCloseGigDetails = () => {
    setSelectedGig(null);
    setIsGigDetailsOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-8 p-10 text-white">
      {/* Scheduled and Pending Gigs */}
      <div className="container mx-auto flex-1 rounded-lg bg-gray-800 p-6 shadow-lg">
        <h1 className="mb-3 text-xl font-bold">Scheduled Gigs</h1>
        <PostedGigListHome
          gigs={scheduledGigs.map((gig) => ({
            gig,
            lister: users.find((user) => user.userId === gig.listerId)!,
          }))}
          showDateWithLine={true}
          showCompletedButton={true}
          showSeeMoreButton={true}
          showChatIcon={true}
          onSelectGig={handleSeeMoreClick} // Pass handler for See More button
        />
        <h1 className="mb-4 mt-8 text-xl font-bold">Pending Gigs</h1>
        <PostedGigListHome
          gigs={pendingGigs.map((gig) => ({
            gig,
            lister: users.find((user) => user.userId === gig.listerId)!,
          }))}
          showDateWithLine={true}
          showUndoButton={true}
          onSelectGig={handleSeeMoreClick} // Pass handler for See More button
        />
      </div>

      {/* Calendar */}
      <div className="w-1/3">
        <Calendar scheduledGigs={scheduledGigs} pendingGigs={pendingGigs} />
      </div>

      {/* Gig Details Modal */}
      {selectedGig && isGigDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-[800px] rounded-lg bg-gray-900 p-6 shadow-lg ">
            <GigDetails
              gig={selectedGig}
              user={users.find((user) => user.userId === selectedGig.listerId)!}
              onEditSave={(updatedGig) => {
                console.log("Gig updated:", updatedGig);
                setIsGigDetailsOpen(false);
              }}
              onDelete={() => {
                console.log("Gig deleted:", selectedGig.gigId);
                setIsGigDetailsOpen(false);
              }}
              showEdit={false}
              showDelete={false}
            />
            <div className="mt-4 flex justify-end">
              <CustomButton
                label="Close"
                onClick={handleCloseGigDetails}
                color="red"
                textColor="black"
                size="medium"
                rounded={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleView;
