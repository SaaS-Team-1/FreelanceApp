import { User } from "@/utils/database/schema";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Button, Modal } from "flowbite-react";
import { PropsWithChildren } from "react";
import { HiOutlineGift } from "react-icons/hi";
import { useFirestore } from "@/utils/reactfire";

interface StreakModalProps {
  openModal: boolean;
  setOpenModal: (set: boolean) => void;
  loginStreak: number;
  user: User;
}

export default function StreakModal({
  openModal,
  setOpenModal,
  loginStreak,
  user,
}: PropsWithChildren<StreakModalProps>) {
  const calculateReward = (streak: number): number => {
    return Math.floor((streak - 1) / 7) + 1; // Reward increases every 7 days
  };

  const reward = calculateReward(loginStreak);

  const db = useFirestore();

  const updateCoins = async () => {
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("userId", "==", user.userId)); 
    const userSnapshot = await getDocs(userQuery);

    const coins = user.coins;

    if (!userSnapshot.empty && coins !== undefined) {
        const userDoc = userSnapshot.docs[0]; // Get the first document
        const userDocRef = userDoc.ref;

        await updateDoc(userDocRef, { coins: coins + reward });
    }
  }

  const handleCloseModal = async () => {
    await updateCoins(); // Update coins when modal is closed
    setOpenModal(false); // Close the modal
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
            Your reward: <span className="font-semibold">{reward} coins</span> 🎉
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
