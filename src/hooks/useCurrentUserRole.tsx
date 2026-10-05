'use client';

import { getCurrentUserRole } from '@/services/auth/auth.service';
import { TUserRole } from '@/types/userRole.types';
import { useEffect, useState } from 'react';

export const useCurrentUserRole = () => {
  const [role, setRole] = useState<TUserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const data = await getCurrentUserRole();
        if (data && data.role) {
          setRole(data.role);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadRole();
  }, []);

  return {
    role,
    loading,
  };
};
