'use client';

import React, { useState, useRef, useEffect } from 'react';

/**
 * Modal backdrop component.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Modal component
 */
function Modal({ isOpen, onClose, children, className = '' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className={`relative bg-card border border-border rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}>
        {children}
      </div>
    </div>
  );
}

/**
 * Input field component with validation styling.
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.hasError - Whether input has error
 * @param {string} props.errorMessage - Error message
 * @param {number} props.maxLength - Maximum length
 * @param {boolean} props.autoFocus - Whether to auto-focus
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} ValidatedInput component
 */
function ValidatedInput({ 
  value, 
  onChange, 
  placeholder = '', 
  hasError = false,
  errorMessage = '',
  maxLength = 20,
  autoFocus = false,
  className = '' 
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const inputClasses = `
    w-full px-3 py-2 text-base border rounded-md
    bg-background text-foreground
    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
    transition-all duration-150
    ${hasError 
      ? 'border-destructive focus:border-destructive focus:ring-destructive' 
      : 'border-input focus:border-ring'
    }
    ${className}
  `;

  return (
    <div className="space-y-1">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={inputClasses}
        autoComplete="off"
        spellCheck="false"
      />
      
      <div className="flex justify-between items-center text-xs">
        <span className={hasError ? 'text-destructive' : 'text-muted-foreground'}>
          {hasError ? errorMessage : ' '}
        </span>
        <span className="text-muted-foreground">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

/**
 * Player name input modal component.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onSubmit - Submit handler with name parameter
 * @param {Function} props.onClose - Close handler
 * @param {string} props.initialName - Initial name value
 * @param {boolean} props.required - Whether name is required
 * @param {string} props.title - Modal title
 * @param {string} props.description - Modal description
 * @returns {JSX.Element} PlayerNameInput component
 */
export function PlayerNameInput({ 
  isOpen, 
  onSubmit, 
  onClose, 
  initialName = '',
  required = true,
  title = 'Enter Your Name',
  description = 'Enter your name to start playing and track your scores on the leaderboard.'
}) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, initialName]);

  const validateName = (nameValue) => {
    const trimmedName = nameValue.trim();
    
    if (required && !trimmedName) {
      return 'Name is required';
    }
    
    if (trimmedName.length < 2) {
      return 'Name must be at least 2 characters';
    }
    
    if (trimmedName.length > 20) {
      return 'Name must be 20 characters or less';
    }
    
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
      return 'Name can only contain letters, numbers, spaces, hyphens, and underscores';
    }
    
    return '';
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(name.trim());
    } catch {
      setError('Failed to save name. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Removed unused handleKeyDown function

  return (
    <Modal isOpen={isOpen} onClose={required ? undefined : onClose}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm">
            {description}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <ValidatedInput
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name..."
            hasError={!!error}
            errorMessage={error}
            maxLength={20}
            autoFocus={true}
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            {!required && (
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary border border-border rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                Skip
              </button>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting || (!name.trim() && required)}
              className="flex-1 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Start Playing'
              )}
            </button>
          </div>
        </form>

        {/* Help text */}
        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>Your name will be used to track your scores on the leaderboard.</p>
          <p className="mt-1">You can change it later in the settings.</p>
        </div>
      </div>
    </Modal>
  );
}

/**
 * Compact player name input for inline usage.
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Current name value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onSubmit - Submit handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} InlinePlayerNameInput component
 */
export function InlinePlayerNameInput({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = 'Enter your name...',
  className = '' 
}) {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedName = value.trim();
    if (!trimmedName) {
      setError('Name is required');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    setError('');
    onSubmit(trimmedName);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
      <ValidatedInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        hasError={!!error}
        errorMessage={error}
        maxLength={20}
      />
      
      <button
        type="submit"
        disabled={!value.trim()}
        className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
      >
        Save Name
      </button>
    </form>
  );
}

/**
 * Player name display with edit functionality.
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Current player name
 * @param {Function} props.onEdit - Edit handler
 * @param {boolean} props.canEdit - Whether name can be edited
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} PlayerNameDisplay component
 */
export function PlayerNameDisplay({ 
  name, 
  onEdit, 
  canEdit = true,
  className = '' 
}) {
  return (
    <div className={`flex items-center justify-between p-3 bg-card border border-border rounded-lg ${className}`}>
      <div>
        <div className="text-sm text-muted-foreground">Player</div>
        <div className="font-medium text-foreground">
          {name || 'Anonymous'}
        </div>
      </div>
      
      {canEdit && (
        <button
          onClick={onEdit}
          className="px-3 py-1 text-xs font-medium text-muted-foreground bg-secondary border border-border rounded hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-150"
        >
          Edit
        </button>
      )}
    </div>
  );
}

export default PlayerNameInput;