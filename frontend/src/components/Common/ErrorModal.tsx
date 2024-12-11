import { Modal } from "flowbite-react";
import { PropsWithChildren, ReactNode } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface ErrorModalProps {
  openModal: boolean;
  setOpenModal: (set: boolean) => void;
  title?: ReactNode;
}

export default function ErrorModal({
  openModal,
  setOpenModal,
  children,
  title,
}: PropsWithChildren<ErrorModalProps>) {
  return (
    <Modal
      show={openModal}
      size="md"
      onClose={() => setOpenModal(false)}
      popup
      dismissible
    >
      <Modal.Header>{title}</Modal.Header>

      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto my-4 size-14 text-on-surface" />
          <div className="flex justify-center gap-4">{children}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
