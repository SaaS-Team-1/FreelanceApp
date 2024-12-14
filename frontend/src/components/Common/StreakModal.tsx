import { useFunctions } from "@/utils/reactfire";
import { httpsCallable } from "firebase/functions";
import { Button, Modal } from "flowbite-react";
import { PropsWithChildren } from "react";
import { HiOutlineGift } from "react-icons/hi";
import { toast } from "react-toastify";

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
      toast("Reward successfully added to the user's account.");
    } else {
      toast.error("Error adding reward:" + paymentStatus);
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
      <Modal.Header>
        <div className="p-2">Login Streak!</div>
      </Modal.Header>

      <Modal.Body>
        <div className="mt-10 rounded-xl bg-surface-container py-8 text-center text-on-surface">
          <HiOutlineGift className=" text-bold mx-auto mb-6 size-20 text-amber-500" />

          <p className="mb-4 text-lg ">
            You've logged in for{" "}
            <span className="font-semibold">{loginStreak} days</span> in a row!
          </p>
          <p className="text-lg">
            Your reward: <span className="font-semibold">{reward} coins</span>{" "}
            🎉
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleCloseModal}
          color="tertiary"
          className="ml-auto justify-self-end"
        >
          Claim Reward
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
