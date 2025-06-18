
import React from "react";
import Modal from "./Modal";
import ColumnSelector from "./ColumnSelector";

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ColumnModal: React.FC<ColumnModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} positionClasses="right-2 w-72">
      <ColumnSelector />
    </Modal>
  );
};

export default ColumnModal;