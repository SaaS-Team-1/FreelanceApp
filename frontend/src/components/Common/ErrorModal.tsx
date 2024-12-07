import { Button, Modal } from "flowbite-react";
import { PropsWithChildren } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface ErrorModalProps {
  openModal: boolean;
  setOpenModal: (set: boolean) => void;
}

export default function ErrorModal({
  openModal,
  setOpenModal,
  children,
}: PropsWithChildren<ErrorModalProps>) {
  return (
    <Modal
      show={openModal}
      size="md"
      onClose={() => setOpenModal(false)}
      popup
      dismissible
    >
      <Modal.Header />

      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 size-14 text-gray-400 dark:text-gray-200" />
          <div className="flex justify-center gap-4">{children}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
