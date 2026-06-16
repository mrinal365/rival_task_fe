import React, { useEffect } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all animate-fade-in">
      {/* Click outside to close overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal box */}
      <div className="relative w-full sm:max-w-lg bg-white border-t sm:border border-[#e5e8ef] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto transition-transform duration-300 transform translate-y-0">
        <div className="sm:hidden w-12 h-1 bg-zinc-200 rounded-full mx-auto mb-4 -mt-2" />

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0f172a]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#6b7890] hover:text-[#0f172a] font-bold cursor-pointer text-lg p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
