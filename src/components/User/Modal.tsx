import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  positionClasses: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  positionClasses,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute ${positionClasses} mt-2 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200`}
    >
      {children}
    </div>
  );
};

export default Modal;
