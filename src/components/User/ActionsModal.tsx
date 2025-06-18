
import React from "react";
import Modal from "./Modal";
import ActionsList from "./ActionsList";

interface ActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActionsModal: React.FC<ActionsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} positionClasses="right-0 w-56">
      <ActionsList />
    </Modal>
  );
};

export default ActionsModal;