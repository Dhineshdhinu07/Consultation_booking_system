'use client';

import { RoleGuard } from '@/components/RoleGuard';
import Navbar from '@/components/Navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white dark:from-gray-950 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </RoleGuard>
  );
} 