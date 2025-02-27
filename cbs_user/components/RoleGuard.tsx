'use client';

import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import type { UserRole } from '@/lib/types/auth';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/dashboard',
  loadingComponent,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // If no user is found, redirect to login
        if (!user) {
          const currentPath = window.location.pathname;
          router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
          return;
        }

        // Check if user has the required role
        if (!allowedRoles.includes(user.role)) {
          router.push(fallbackPath);
          return;
        }

        // User is authorized
        setIsAuthorized(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthorization();
  }, [user, allowedRoles, fallbackPath, router]);

  if (isChecking) {
    return loadingComponent || (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}; 