'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with SSR safety and error handling.
 *
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Initial value if no stored value exists
 * @returns {Array} [storedValue, setValue] tuple
 */
export function useLocalStorage(key, initialValue) {
  // Track hydration state to prevent SSR/client mismatch
  const [isHydrated, setIsHydrated] = useState(false);
  
  // State to store our value - always start with initialValue for SSR safety
  const [storedValue, setStoredValue] = useState(initialValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Save state first to get the current value if value is a function
      setStoredValue(currentValue => {
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        
        return valueToStore;
      });
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // Hydrate stored value after component mounts to prevent SSR mismatch
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}" on mount:`, error);
      }
    }
  }, [key]);

  return [storedValue, setValue, isHydrated];
}

/**
 * Hook for managing localStorage with additional utilities.
 *
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Initial value if no stored value exists
 * @returns {Object} Object with value, setValue, removeValue, and isLoading
 */
export function useLocalStorageAdvanced(key, initialValue) {
  const [isLoading, setIsLoading] = useState(true);
  const [storedValue, setStoredValue] = useState(initialValue);

  // Initialize value from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [key]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
  };
}

/**
 * Hook for managing multiple localStorage keys as a single object.
 *
 * @param {Object} initialValues - Object with key-value pairs for initial values
 * @returns {Object} Object with values, setValues, and individual setter functions
 */
export function useMultipleLocalStorage(initialValues) {
  const [values, setValuesState] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValues;
    }

    const loadedValues = {};
    Object.keys(initialValues).forEach(key => {
      try {
        const item = window.localStorage.getItem(key);
        loadedValues[key] = item ? JSON.parse(item) : initialValues[key];
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        loadedValues[key] = initialValues[key];
      }
    });
    
    return loadedValues;
  });

  const setValues = (newValues) => {
    setValuesState(prevValues => {
      const updatedValues = { ...prevValues, ...newValues };
      
      // Save each value to localStorage
      if (typeof window !== 'undefined') {
        Object.keys(newValues).forEach(key => {
          try {
            window.localStorage.setItem(key, JSON.stringify(updatedValues[key]));
          } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
          }
        });
      }
      
      return updatedValues;
    });
  };

  const setValue = (key, value) => {
    setValues({ [key]: value });
  };

  return {
    values,
    setValues,
    setValue,
  };
}

/**
 * Hook to check if localStorage is available.
 *
 * @returns {boolean} True if localStorage is available
 */
export function useIsLocalStorageAvailable() {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    try {
      const test = '__localStorage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      setIsAvailable(true);
    } catch (error) {
      setIsAvailable(false);
    }
  }, []);

  return isAvailable;
}