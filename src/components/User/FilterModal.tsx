// src/components/modals/FilterModal.tsx
import React from "react";
import DepartmentFilter from "./DepartmentFilter";
import Modal from "./Modal";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} positionClasses="right-0 w-72">
      <DepartmentFilter />
    </Modal>
  );
};

export default FilterModal;
