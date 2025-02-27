'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-200">Email</Label>
          <Input 
            id="email" 
            placeholder="Enter your email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">Password</Label>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={isLoading}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-white text-gray-900 hover:bg-black hover:text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Logging in...</span>
          </div>
        ) : (
          'Login'
        )}
      </Button>

      <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-gray-800 after:h-px after:flex-1 after:bg-gray-800">
        <span className="text-xs text-gray-500">Or</span>
      </div>

      <Button 
        type="button" 
        variant="outline" 
        className="w-full bg-white border-gray-800 text-gray-900 hover:bg-black hover:text-white"
        asChild
      >
        <Link href="/register">Sign up</Link>
      </Button>

      <p className="text-center text-xs text-gray-500">
        Don't have an account?{" "}
        <Link href="/register" className="text-gray-300 underline hover:no-underline">
          Sign up
        </Link>
      </p>
    </form>
  );
} 