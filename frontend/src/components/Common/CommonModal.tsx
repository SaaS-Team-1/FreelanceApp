import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface CommonModalProps {
  isOpen: boolean;
  onClose?: () => void;
  scroll?: boolean;
}

export default function CommonModal({
  isOpen,
  onClose,
  scroll,
  children,
}: PropsWithChildren<CommonModalProps>) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        onClose();
      }
    },
    [onClose],
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      if (onClose) {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="relative z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      ></div>

      {/* Modal Content */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <div
          ref={modalRef}
          className={`${scroll && "scrollbar overflow-y-scroll"} max-h-[80vh] max-w-[50vw] rounded-lg bg-gray-800`}
          tabIndex={-1}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
