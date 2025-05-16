import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
  maxWidth?: string;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  children, 
  className = '', 
  title, 
  maxWidth = 'max-w-3xl',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-y-auto p-4">
      <div 
        className="fixed inset-0 transition-opacity" 
        aria-hidden="true"
      ></div>
      
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full my-8 relative z-10 ${className}`}
      >
        {title && (
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-2xl font-semibold">{title}</h2>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
        
        <div className="px-6 pb-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-all duration-150 shadow-sm"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all duration-150 shadow-sm"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
