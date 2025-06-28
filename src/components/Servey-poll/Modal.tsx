import React from 'react';

interface ModalProps {
      children: React.ReactNode;
      isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen }) => {
      if (!isOpen) return null;
      return (
            <div className="fixed inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
                        {children}
                  </div>
            </div>
      );
};

export default Modal;