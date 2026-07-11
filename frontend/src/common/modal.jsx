import React, { useEffect, useRef } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Batal',
  showConfirmButton = true,
  showCancelButton = false,
  isLoading = false,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-emerald-400',
          iconBg: 'bg-emerald-500/20',
          borderColor: 'border-emerald-500/30',
          confirmBtnColor: 'bg-emerald-600 hover:bg-emerald-700',
        };
      case 'error':
        return {
          icon: XCircle,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          confirmBtnColor: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-400',
          iconBg: 'bg-amber-500/20',
          borderColor: 'border-amber-500/30',
          confirmBtnColor: 'bg-amber-600 hover:bg-amber-700',
        };
      case 'loading':
        return {
          icon: null,
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          confirmBtnColor: 'bg-blue-600 hover:bg-blue-700',
        };
      case 'info':
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          confirmBtnColor: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full 
          border ${styles.borderColor} 
          animate-scaleIn
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className={`p-2 rounded-xl ${styles.iconBg}`}>
                <svg
                  className="animate-spin h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : (
              IconComponent && (
                <div className={`p-2 rounded-xl ${styles.iconBg}`}>
                  <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
                </div>
              )
            )}
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300 text-center">{message}</p>
        </div>

        {/* Footer - Only show if not loading */}
        {!isLoading && (
          <div className="flex justify-center gap-3 p-4 border-t border-slate-700/50">
            {showCancelButton && (
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-300 transition"
              >
                {cancelText}
              </button>
            )}
            {showConfirmButton && (
              <button
                onClick={handleConfirm}
                className={`px-6 py-2.5 ${styles.confirmBtnColor} rounded-xl text-sm font-medium text-white transition shadow-lg`}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { 
              opacity: 0;
              transform: scale(0.95) translateY(20px);
            }
            to { 
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
          .animate-scaleIn {
            animation: scaleIn 0.25s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default Modal;