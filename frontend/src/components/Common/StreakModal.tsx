import { useFunctions } from "@/utils/reactfire";
import { httpsCallable } from "firebase/functions";
import { Button, Modal } from "flowbite-react";
import { PropsWithChildren } from "react";
import { HiOutlineGift } from "react-icons/hi";

interface StreakModalProps {
  openModal: boolean;
  setOpenModal: (set: boolean) => void;
  loginStreak: number;
}

export default function StreakModal({
  openModal,
  setOpenModal,
  loginStreak,
}: PropsWithChildren<StreakModalProps>) {
  const calculateReward = (streak: number): number => {
    return Math.floor((streak - 1) / 7) + 1; // Reward increases every 7 days
  };

  const reward = calculateReward(loginStreak);

  const functions = useFunctions();

  const handleCloseModal = async () => {
    setOpenModal(false); // Close the modal
    const result = await httpsCallable<void, { paymentStatus: string }>(
      functions,
      "stripe-loginReward",
    )();
    const { paymentStatus } = result.data;
    if (paymentStatus === "paid") {
      console.log("Reward successfully added to the user's account.");
    } else {
      console.error("Error adding reward:", paymentStatus);
    }
  };

  return (
    <Modal
      show={openModal}
      size="md"
      onClose={handleCloseModal}
      popup
      dismissible
    >
      <Modal.Header />

      <Modal.Body>
        <div className="text-center">
          <HiOutlineGift className="mx-auto mb-4 size-14 text-yellow-500 dark:text-yellow-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            Login Streak Achieved!
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            You've logged in for{" "}
            <span className="font-semibold">{loginStreak} days</span> in a row!
          </p>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Your reward: <span className="font-semibold">{reward} coins</span>{" "}
            🎉
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={handleCloseModal} color="success">
              Claim Reward
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
