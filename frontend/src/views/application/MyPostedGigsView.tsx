import React, { useState } from "react";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import GigDetails from "@/components/Gigs/GigDetails";
import InterestedGigglers from "@/components/Gigs/InterestedGigglers"; // Import the new component
import { Gig, User } from "@/utils/database/schema";
import { Timestamp } from "firebase/firestore";

function MyPostedGigsView() {
  // Dummy data for demonstration
  const currentUserId = "user1"; // Replace with the current user's ID

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
      completedGigs: ["gig2", "gig4"],
      activeGigs: ["gig3", "gig5"],
      listedGigs: ["gig1", "gig3", "gig5", "gig6", "gig7"],
      averageRating: 4.5,
    },
    {
      userId: "user2",
      email: "john.doe@example.com",
      displayName: "John Doe",
      profile: {
        bio: "Freelance driver based in Charleroi.",
        credits: 150,
        picture: "https://via.placeholder.com/40",
        location: "Charleroi",
      },
      completedGigs: ["gig3"],
      activeGigs: [],
      listedGigs: ["gig4"],
      averageRating: 4.7,
    },
    {
      userId: "user3",
      email: "applicant.one@example.com",
      displayName: "Anil Ano",
      profile: {
        bio: "Freelance graphic designer.",
        credits: 80,
        picture: "https://via.placeholder.com/40",
        location: "Brussels",
      },
      completedGigs: [],
      activeGigs: ["gig1"],
      listedGigs: [],
      averageRating: 4.2,
    },
    {
      userId: "user4",
      email: "applicant.two@example.com",
      displayName: "Ompa Lompa",
      profile: {
        bio: "Video editor with 5 years of experience.",
        credits: 90,
        picture: "https://via.placeholder.com/40",
        location: "Antwerp",
      },
      completedGigs: [],
      activeGigs: ["gig2"],
      listedGigs: [],
      averageRating: 4.0,
    },
    {
      userId: "user5",
      email: "applicant.two@example.com",
      displayName: "Ompa Lompa",
      profile: {
        bio: "Video editor with 5 years of experience.",
        credits: 90,
        picture: "https://via.placeholder.com/40",
        location: "Antwerp",
      },
      completedGigs: [],
      activeGigs: ["gig2"],
      listedGigs: [],
      averageRating: 4.0,
    },
  ];

  const gigs: Gig[] = [
    {
      gigId: "gig1",
      title: "Video Editor Needed",
      description: "I'm looking for as creative video editor to produce a captivating 10-20 second intro for my project centered around peaceful.I'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peacefulI'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peacefulI'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peacefulI'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peacefulI'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peacefulI'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peacefulI'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peacefulI'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peacefulI'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peacefulI'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peacefulI'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peaceful.",
      category: "Video Editing",
      price: 60,
      dueDate: Timestamp.now(),
      status: "in-progress",
      listerId: "user1",
      selectedApplicantId: "user3",
      createdAt: Timestamp.now(),
      location: "Remote",
      applicantIds: ["user3", "user4","user2","user5"], // Replaced applicant IDs with user IDs
    },
    {
      gigId: "gig2",
      title: "Airport Pickup Charleroi",
      description: "Need a driver for airport pickup in Charleroi...",
      category: "Transport",
      price: 30,
      dueDate: Timestamp.now(),
      status: "completed",
      listerId: "user2",
      selectedApplicantId: "user3", // Replaced applicant ID with user ID
      createdAt: Timestamp.now(),
      location: "Charleroi",
      applicantIds: ["user3"], // Replaced applicant ID with user ID
    },
    {
      gigId: "gig3",
      title: "Chemistry Tutoring",
      description: "Looking for an experienced tutor for chemistry lessons...",
      category: "Tutoring",
      price: 0,
      dueDate: Timestamp.now(),
      status: "in-progress",
      listerId: "user1",
      selectedApplicantId: "user4", // Replaced applicant ID with user ID
      createdAt: Timestamp.now(),
      location: "Brussels",
      applicantIds: ["user3", "user4"], // Replaced applicant IDs with user IDs
    },
    {
      gigId: "gig4",
      title: "Graphic Design Project",
      description: "Seeking a graphic designer to create a logo and branding for a new startup.",
      category: "Graphic Design",
      price: 100,
      dueDate: Timestamp.now(),
      status: "completed",
      listerId: "user1",
      selectedApplicantId: "user3", // Replaced applicant ID with user ID
      createdAt: Timestamp.now(),
      location: "Remote",
      applicantIds: ["user3"], // Replaced applicant ID with user ID
    },
    {
      gigId: "gig5",
      title: "Website Development",
      description: "Looking for a skilled web developer to build a responsive website for a local business.",
      category: "Web Development",
      price: 500,
      dueDate: Timestamp.now(),
      status: "open",
      listerId: "user1",
      selectedApplicantId: undefined,
      createdAt: Timestamp.now(),
      location: "Antwerp",
      applicantIds: ["user4"], // Replaced applicant ID with user ID
    },
    {
      gigId: "gig5",
      title: "Website Dev",
      description: "Looking for a skilled web developer to build a responsive website for a local business.",
      category: "Web Development",
      price: 500,
      dueDate: Timestamp.now(),
      status: "open",
      listerId: "user1",
      selectedApplicantId: undefined,
      createdAt: Timestamp.now(),
      location: "Brussels",
      applicantIds: [], // Replaced applicant ID with user ID
    },
  ];

  // Get the current user object
  const currentUser = users.find(user => user.userId === currentUserId);

  // Map and filter gigs with their corresponding listers for the current user
  const gigsWithListers = gigs
    .filter(gig => currentUser?.listedGigs.includes(gig.gigId)) // Filter gigs based on listedGigs
    .map(gig => {
      const lister = users.find(user => user.userId === gig.listerId);
      return lister ? { gig, lister } : undefined;
    })
    .filter((item): item is { gig: Gig; lister: User } => item !== undefined);

  const [selectedGig, setSelectedGig] = useState<Gig | null>(gigsWithListers[0]?.gig || null);

  const handleSelectGig = (gig: Gig) => {
    setSelectedGig(gig); // Update the selected gig
  };

  return (
    <div className="flex space-x-6 p-6">
      {/* Left section with the list of gigs */}
      <div className="h-full w-4/5">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
          My Posted Gigs
        </h2>
        <PostedGigListHome
          gigs={gigsWithListers}
          onSelectGig={handleSelectGig}
          selectedGig={selectedGig}
          enableSelection={true}
          showSeeMoreButton={false} // Toggle this prop to show/hide the button
        />
      </div>

      {/* Right section with gig details */}
      <div className="h-full w-3/5">
        <div className="rounded-lg p-6 ">
          {selectedGig ? (
            <>
              <GigDetails
                gig={selectedGig}
                user={users.find(user => user.userId === selectedGig.listerId)!} // Find the lister by userId
                onEdit={function (): void {
                  throw new Error("Function not implemented.");
                } } onDelete={function (): void {
                  throw new Error("Function not implemented.");
                } }              />
              {/* Display interested gigglers */}
              <InterestedGigglers
                gig={selectedGig}
                users={users} // Pass the full list of users
              />
            </>
          ) : (
            <p className="text-gray-500">Select a gig to see the details</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPostedGigsView;