'use client';

import { useAppSelector } from '@/redux/hooks';
import { TUserRole } from '@/types/userRole.types';
import { useEffect, useState } from 'react';

export const useCurrentUserRole = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [role, setRole] = useState<TUserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role) {
      setRole(user.role as TUserRole);
    } else {
      setRole(null);
    }
    setLoading(false);
  }, [user]);

  return {
    role,
    loading,
  };
};
