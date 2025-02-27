'use client';

import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-white dark:bg-gray-900">
        {children}
      </main>
    </>
  );
} 