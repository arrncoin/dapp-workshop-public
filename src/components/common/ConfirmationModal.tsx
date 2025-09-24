// src/components/common/ConfirmationModal.tsx
import React from 'react';
import '../../styles/ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  backdropImage?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  backdropImage = "/img/kimcil.png",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  // Mengirim URL gambar sebagai CSS custom property
  const cardStyle = {
    '--backdrop-image': `url(${backdropImage})`,
  } as React.CSSProperties;

  return (
    <div className="modal-backdrop animate-fade-in">
      <div style={cardStyle} className="modal-card animate-fade-in-up">
        
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        
        <div className="modal-actions">
          <button onClick={onClose} className="modal-button cancel">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="modal-button confirm">
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}