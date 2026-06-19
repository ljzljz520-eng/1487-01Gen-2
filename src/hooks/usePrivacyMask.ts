import { useState, useCallback } from 'react';
import type { MaskFieldType } from '../types/patient';
import { maskValue } from '../utils/privacyMask';

interface UsePrivacyMaskOptions {
  enabled?: boolean;
  requireAuth?: boolean;
}

interface UsePrivacyMaskReturn {
  isMasked: boolean;
  isAuthorized: boolean;
  maskValue: (value: string, fieldType: MaskFieldType) => string;
  toggleMask: () => void;
  authorize: (password?: string) => boolean;
  deauthorize: () => void;
}

export function usePrivacyMask(
  options: UsePrivacyMaskOptions = {}
): UsePrivacyMaskReturn {
  const { enabled = true, requireAuth = true } = options;
  
  const [isMasked, setIsMasked] = useState(enabled);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const mask = useCallback((value: string, fieldType: MaskFieldType): string => {
    if (!isMasked) return value;
    return maskValue(value, fieldType);
  }, [isMasked]);

  const toggleMask = useCallback(() => {
    if (!requireAuth || isAuthorized) {
      setIsMasked(prev => !prev);
    }
  }, [requireAuth, isAuthorized]);

  const authorize = useCallback((password?: string): boolean => {
    if (!requireAuth) {
      setIsAuthorized(true);
      return true;
    }
    
    const authorized = password === '123456';
    if (authorized) {
      setIsAuthorized(true);
    }
    return authorized;
  }, [requireAuth]);

  const deauthorize = useCallback(() => {
    setIsAuthorized(false);
    setIsMasked(true);
  }, []);

  return {
    isMasked,
    isAuthorized,
    maskValue: mask,
    toggleMask,
    authorize,
    deauthorize
  };
}
