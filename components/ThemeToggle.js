'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * Theme toggle icon component.
 *
 * @param {Object} props - Component props
 * @param {string} props.theme - Current theme ('light', 'dark', 'system')
 * @param {string} props.size - Icon size ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} ThemeIcon component
 */
function ThemeIcon({ theme, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconClass = `${sizeClasses[size]} ${className}`;

  if (theme === 'dark') {
    return (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    );
  }

  if (theme === 'system') {
    return (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }

  // Default to light theme icon
  return (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

/**
 * Simple theme toggle button.
 *
 * @param {Object} props - Component props
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {string} props.variant - Button variant ('default', 'ghost', 'outline')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} ThemeToggle component
 */
export function ThemeToggle({ size = 'md', variant = 'default', className = '' }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return (
      <div className={`inline-flex items-center justify-center rounded-md ${
        size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
      } ${className}`} />
    );
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const variantClasses = {
    default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  };

  const buttonClasses = `
    inline-flex items-center justify-center rounded-md font-medium
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
    active:scale-95
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Switch to Dark Mode';
      case 'dark': return 'Switch to Light Mode';
      default: return 'Toggle Theme';
    }
  };

  return (
    <button
      className={buttonClasses}
      onClick={toggleTheme}
      title={getThemeLabel()}
      aria-label={getThemeLabel()}
    >
      <ThemeIcon theme={theme} size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} />
    </button>
  );
}

/**
 * Theme toggle with label and current theme indicator.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.showLabel - Whether to show theme label
 * @param {string} props.orientation - Layout orientation ('horizontal', 'vertical')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} ThemeToggleWithLabel component
 */
export function ThemeToggleWithLabel({ 
  showLabel = true, 
  orientation = 'horizontal',
  className = '' 
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-10 h-10 bg-muted rounded-md animate-pulse" />
        {showLabel && <div className="w-16 h-4 bg-muted rounded animate-pulse" />}
      </div>
    );
  }

  const getThemeDisplayName = () => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      default: return 'Light';
    }
  };

  const containerClasses = orientation === 'vertical' 
    ? 'flex flex-col items-center gap-2' 
    : 'flex items-center gap-3';

  return (
    <div className={`${containerClasses} ${className}`}>
      <ThemeToggle variant="outline" />
      
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm font-medium">Theme</span>
          <span className="text-xs text-muted-foreground">
            {getThemeDisplayName()}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Theme selector dropdown with all theme options.
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} ThemeSelector component
 */
export function ThemeSelector({ className = '' }) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-32 h-10 bg-muted rounded-md animate-pulse ${className}`} />
    );
  }

  const themes = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'system', label: 'System', icon: 'computer' },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];

  return (
    <div className={`relative ${className}`}>
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-background border border-input rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <ThemeIcon theme={resolvedTheme} size="sm" />
          <span>{currentTheme.label}</span>
        </div>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-20">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                  hover:bg-accent hover:text-accent-foreground
                  ${theme === themeOption.value ? 'bg-accent text-accent-foreground' : ''}
                `}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
              >
                <ThemeIcon theme={themeOption.value} size="sm" />
                <span>{themeOption.label}</span>
                {theme === themeOption.value && (
                  <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Compact theme toggle for mobile or space-constrained layouts.
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} CompactThemeToggle component
 */
export function CompactThemeToggle({ className = '' }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={`w-8 h-8 bg-muted rounded animate-pulse ${className}`} />;
  }

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <button
      className={`w-8 h-8 flex items-center justify-center rounded hover:bg-accent transition-colors ${className}`}
      onClick={cycleTheme}
      title="Toggle Theme"
    >
      <ThemeIcon theme={theme} size="sm" />
    </button>
  );
}

export default ThemeToggle;