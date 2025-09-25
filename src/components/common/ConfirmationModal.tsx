// src/components/common/ConfirmationModal.tsx
import React, { useEffect, useRef } from 'react';
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
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  backdropImage = '/img/kimcil.png',
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Custom CSS variable untuk background
  const cardStyle = {
    '--backdrop-image': `url(${backdropImage})`,
  } as React.CSSProperties;

  // Tutup dengan ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Autofokus ke modal saat terbuka
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      className="modal-backdrop animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        style={cardStyle}
        className="modal-card animate-fade-in-up"
        tabIndex={-1}
      >
        {/* Tombol close (aksesibilitas penting) */}
        <button
          type="button"
          className="modal-close"
          aria-label="Close modal"
          onClick={onClose}
        >
          ×
        </button>

        <h3 id="modal-title" className="modal-title">
          {title}
        </h3>
        <p
          id="modal-description"
          className="modal-message"
          aria-live="polite"
        >
          {message}
        </p>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="modal-button cancel"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="modal-button confirm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
