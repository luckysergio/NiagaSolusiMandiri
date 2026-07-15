import React, { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

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
          animate-scaleIn overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-center p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className={`p-3 rounded-xl ${styles.iconBg}`}>
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            ) : (
              IconComponent && (
                <div className={`p-3 rounded-xl ${styles.iconBg}`}>
                  <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
                </div>
              )
            )}
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300 text-center leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className="flex justify-center gap-3 p-6 border-t border-slate-700/50 bg-slate-800/30">
            {showCancelButton && (
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-sm font-semibold text-slate-300 transition-all duration-200 active:scale-95"
              >
                {cancelText}
              </button>
            )}
            {showConfirmButton && (
              <button
                onClick={handleConfirm}
                className={`px-6 py-2.5 ${styles.confirmBtnColor} rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-lg active:scale-95`}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;