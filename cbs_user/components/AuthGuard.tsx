"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [user, router]);

  return <>{user ? children : null}</>;
};