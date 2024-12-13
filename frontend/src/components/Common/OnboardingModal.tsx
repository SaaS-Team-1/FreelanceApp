import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: "Welcome to UniGig",
    content:
      "This website allows students to post and apply for gigs, providing them with a convenient and safe platform to freelance.",
    image: "/homepage.webp", // Screenshot for this step
  },
  {
    title: "Home Page",
    content:
      "In the home page, you can view all available gigs and filter them. The home page also provides simplified views for your notifications and posted gigs.",
    image: "/onboarding/homepage.png", // Screenshot for this step
  },
  {
    title: "Applying to Gigs",
    content:
      "Clicking on see more on a gig in the home page allows you to apply to it. Once you've done so, you can navigate to the schedule tab to view the gigs you've applied to and been assigned.",
    image: "/onboarding/apply.png", // Screenshot for this step
  },
  {
    title: "Chat",
    content:
      "After applying to a gig, a chat is created between you and the gig poster and can be accessed through the sidebar. This allows you to pitch your skills and work out the details of the gig. The gig poster is also able to assign the gig to the applicant in this page.",
    image: "/onboarding/chat.png", // Screenshot for this step
  },
  {
    title: "Creating Gigs",
    content:
      "You can create gigs by clicking on the create a new gig button or on the plus below your profile in the sidebar. Make sure to fill in all the fields and set an appropriate reward.",
    image: "/onboarding/create.png", // Screenshot for this step
  },
  {
    title: "View your Gigs",
    content:
      "Once you've created a gig you can see it in the My Posted Gigs page, accessible through the sidebar. This page also allows you to view who applied for your gig and to assign it to someone to complete.",
    image: "/onboarding/posted.png", // Screenshot for this step
  },
  //HERE
  {
    title: "Coins",
    content:
      "To assign gigs to users, you must first have enough coins, which are obtained through completing gigs and the wallet page. In the Wallet you are able to deposit and withdraw coins to your account using a credit card.",
    image: "/onboarding/coins.png", // Screenshot for this step
  },
  {
    title: "Profile",
    content:
      "Navigating to Profile with the sidebar allows you to view and edit details such as your bio, number of credits taken in university, and faculty.",
    image: "/onboarding/profile.png", // Screenshot for this step
  },
  {
    title: "Login Streak",
    content:
      "Logging in daily rewards you with a small number of coins, increasing every week the streak continues. Simply navigate to the home page to view new available gigs and receive your reward. Remember to login everyday or your streak will reset :).",
    image: "/onboarding/login-streak.png", // Screenshot for this step
  },
  {
    title: "Account Level",
    content:
      "The number of gigs you've completed is saved and allows you to level up, which allows other users to see how experienced you are. Complete plenty of gigs to reach Pro level!",
    image: "/onboarding/level.png", // Screenshot for this step
  },
  {
    title: "Leaderboard",
    content:
      "Users who complete the most gigs will be displayed in the leaderboard for everyone to see.",
    image: "/onboarding/leaderboard.png", // Screenshot for this step
  },
];

function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Modal show={isOpen} onClose={() => {}} dismissible={false}>
      <Modal.Header>{tutorialSteps[currentStep].title}</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center space-y-4">
          <img
            src={tutorialSteps[currentStep].image}
            alt={tutorialSteps[currentStep].title}
            className="max-h-64 rounded-lg"
          />
          <p className="text-center text-base text-on-surface">
            {tutorialSteps[currentStep].content}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full justify-between">
          <Button
            color="surface-container"
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="disabled:opacity-50"
          >
            Previous
          </Button>
          {!isLastStep && (
            <Button color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          {isLastStep && (
            <Button
              color="tertiary"
              onClick={() => {
                setCurrentStep(0);
                onClose();
              }}
            >
              Close
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default TutorialModal;
