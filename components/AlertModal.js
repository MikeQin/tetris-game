'use client';

import React, { useEffect } from 'react';

/**
 * Custom alert modal component with better styling than browser alert.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {string} props.confirmText - Confirm button text
 * @param {string} props.type - Alert type ('info', 'success', 'warning', 'error')
 * @param {boolean} props.autoClose - Whether to auto-close after delay
 * @param {number} props.autoCloseDelay - Auto-close delay in ms
 * @returns {JSX.Element} AlertModal component
 */
export function AlertModal({ 
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Alert',
  message = '',
  confirmText = 'OK',
  cancelText = 'Cancel',
  type = 'info',
  autoClose = false,
  autoCloseDelay = 3000,
  externalCountdown = 0,
  showCancel = false
}) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Auto-close functionality with countdown
  const [countdown, setCountdown] = React.useState(0);

  useEffect(() => {
    if (!isOpen || !autoClose) {
      setCountdown(0);
      return;
    }

    setCountdown(Math.ceil(autoCloseDelay / 1000));

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          headerBg: 'bg-green-50 dark:bg-green-900/20',
          iconColor: 'text-green-600 dark:text-green-400',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 'warning':
        return {
          icon: '⚠️',
          headerBg: 'bg-yellow-50 dark:bg-yellow-900/20',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        };
      case 'error':
        return {
          icon: '❌',
          headerBg: 'bg-red-50 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      default: // info
        return {
          icon: 'ℹ️',
          headerBg: 'bg-blue-50 dark:bg-blue-900/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`
        relative w-full max-w-md mx-auto bg-card border rounded-lg shadow-xl
        transform transition-all duration-200 scale-100
        ${typeStyles.borderColor}
      `}>
        {/* Header */}
        <div className={`px-6 py-4 rounded-t-lg ${typeStyles.headerBg}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{typeStyles.icon}</span>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/50 rounded-b-lg">
          <div className="flex justify-end gap-3">
            {showCancel && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm || onClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              autoFocus
            >
              {externalCountdown > 0 ? `${confirmText} (${externalCountdown}s)` : (autoClose && countdown > 0 ? `${confirmText} (${countdown}s)` : confirmText)}
            </button>
          </div>
          
          {externalCountdown > 0 && (
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Redirecting to leaderboard in {externalCountdown} seconds, or click OK to continue now
            </div>
          )}
          {!externalCountdown && autoClose && countdown > 0 && (
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Redirecting to leaderboard in {countdown} seconds, or click OK to continue now
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for managing alert modal state.
 *
 * @returns {Object} Alert state and functions
 */
export function useAlert() {
  const [alert, setAlert] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    autoClose: false,
    autoCloseDelay: 3000
  });

  const showAlert = React.useCallback((options) => {
    setAlert({
      isOpen: true,
      title: options.title || 'Alert',
      message: options.message || '',
      type: options.type || 'info',
      confirmText: options.confirmText || 'OK',
      autoClose: options.autoClose || false,
      autoCloseDelay: options.autoCloseDelay || 3000,
    });
  }, []);

  const hideAlert = React.useCallback(() => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showSuccess = React.useCallback((message, title = 'Success') => {
    showAlert({ message, title, type: 'success' });
  }, [showAlert]);

  const showError = React.useCallback((message, title = 'Error') => {
    showAlert({ message, title, type: 'error' });
  }, [showAlert]);

  const showWarning = React.useCallback((message, title = 'Warning') => {
    showAlert({ message, title, type: 'warning' });
  }, [showAlert]);

  const showInfo = React.useCallback((message, title = 'Information') => {
    showAlert({ message, title, type: 'info' });
  }, [showAlert]);

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    AlertModal: ({ onClose: externalOnClose, ...props } = {}) => (
      <AlertModal
        isOpen={alert.isOpen}
        onClose={externalOnClose || hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        confirmText={alert.confirmText}
        autoClose={alert.autoClose}
        autoCloseDelay={alert.autoCloseDelay}
        {...props}
      />
    )
  };
}

/**
 * Confirmation modal component for yes/no dialogs.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onConfirm - Confirm handler
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {string} props.confirmText - Confirm button text
 * @param {string} props.cancelText - Cancel button text
 * @param {string} props.type - Alert type ('info', 'success', 'warning', 'error')
 * @returns {JSX.Element} ConfirmModal component
 */
export function ConfirmModal({ 
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Yes',
  cancelText = 'Cancel',
  type = 'warning'
}) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          headerBg: 'bg-green-50 dark:bg-green-900/20',
          iconColor: 'text-green-600 dark:text-green-400',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 'warning':
        return {
          icon: '⚠️',
          headerBg: 'bg-yellow-50 dark:bg-yellow-900/20',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        };
      case 'error':
        return {
          icon: '❌',
          headerBg: 'bg-red-50 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      default: // info
        return {
          icon: 'ℹ️',
          headerBg: 'bg-blue-50 dark:bg-blue-900/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`
        relative w-full max-w-md mx-auto bg-card border rounded-lg shadow-xl
        transform transition-all duration-200 scale-100
        ${typeStyles.borderColor}
      `}>
        {/* Header */}
        <div className={`px-6 py-4 rounded-t-lg ${typeStyles.headerBg}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{typeStyles.icon}</span>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/50 rounded-b-lg">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
              autoFocus
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for managing confirm modal state.
 *
 * @returns {Object} Confirm state and functions
 */
export function useConfirm() {
  const [confirm, setConfirm] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Yes',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null
  });

  const showConfirm = React.useCallback((options) => {
    return new Promise((resolve) => {
      setConfirm({
        isOpen: true,
        title: options.title || 'Confirm Action',
        message: options.message || 'Are you sure you want to proceed?',
        type: options.type || 'warning',
        confirmText: options.confirmText || 'Yes',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: () => {
          resolve(true);
          setConfirm(prev => ({ ...prev, isOpen: false }));
        },
        onCancel: () => {
          resolve(false);
          setConfirm(prev => ({ ...prev, isOpen: false }));
        }
      });
    });
  }, []);

  const hideConfirm = React.useCallback(() => {
    setConfirm(prev => {
      if (prev.onCancel) {
        prev.onCancel();
      }
      return { ...prev, isOpen: false };
    });
  }, []);

  const ConfirmModalComponent = () => (
    <ConfirmModal
      isOpen={confirm.isOpen}
      onClose={hideConfirm}
      onConfirm={confirm.onConfirm}
      title={confirm.title}
      message={confirm.message}
      type={confirm.type}
      confirmText={confirm.confirmText}
      cancelText={confirm.cancelText}
    />
  );

  return {
    confirm,
    showConfirm,
    hideConfirm,
    ConfirmModal: ConfirmModalComponent
  };
}

export default AlertModal;