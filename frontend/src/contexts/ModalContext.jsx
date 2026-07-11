import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../common/Modal';

const ModalContext = createContext(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    onConfirm: null,
    onCancel: null,
    confirmText: 'OK',
    cancelText: 'Batal',
    showConfirmButton: true,
    showCancelButton: false,
    isLoading: false,
  });

  const showModal = useCallback((config) => {
    setModalConfig({
      isOpen: true,
      title: config.title || 'Informasi',
      message: config.message || '',
      type: config.type || 'success',
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null,
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Batal',
      showConfirmButton: config.showConfirmButton !== false,
      showCancelButton: config.showCancelButton || false,
      isLoading: false,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  }, []);

  const showSuccess = useCallback((title, message, onConfirm, confirmText = 'OK') => {
    showModal({
      title,
      message,
      type: 'success',
      onConfirm,
      confirmText,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }, [showModal]);

  const showError = useCallback((title, message, onConfirm, confirmText = 'OK') => {
    showModal({
      title,
      message,
      type: 'error',
      onConfirm,
      confirmText,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }, [showModal]);

  const showInfo = useCallback((title, message, onConfirm, confirmText = 'OK') => {
    showModal({
      title,
      message,
      type: 'info',
      onConfirm,
      confirmText,
      showConfirmButton: true,
      showCancelButton: false,
    });
  }, [showModal]);

  const showWarning = useCallback((title, message, onConfirm, onCancel, confirmText = 'Ya', cancelText = 'Batal') => {
    showModal({
      title,
      message,
      type: 'warning',
      onConfirm,
      onCancel,
      confirmText,
      cancelText,
      showConfirmButton: true,
      showCancelButton: true,
    });
  }, [showModal]);

  const showLoading = useCallback((title = 'Memproses...', message = 'Mohon tunggu sebentar') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: 'loading',
      onConfirm: null,
      onCancel: null,
      confirmText: 'OK',
      cancelText: 'Batal',
      showConfirmButton: false,
      showCancelButton: false,
      isLoading: true,
    });
  }, []);

  const closeLoading = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  }, []);

  const value = {
    showModal,
    closeModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    closeLoading,
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        onCancel={modalConfig.onCancel}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        showConfirmButton={modalConfig.showConfirmButton}
        showCancelButton={modalConfig.showCancelButton}
        isLoading={modalConfig.isLoading}
      />
    </ModalContext.Provider>
  );
};