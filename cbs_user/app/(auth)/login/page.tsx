'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <section className="relative grid min-h-screen place-content-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-24 text-gray-200">
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-overlay backdrop-blur-[1px]" />
      
      <div 
        className="absolute inset-0 opacity-20 backdrop-blur-sm"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-0 backdrop-blur-[2px]">
        <BackgroundBeams />
      </div>

      <div className="relative z-50 w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8 backdrop-blur-sm bg-black/20 p-4 rounded-lg">
          <h1 className="text-2xl font-bold text-white">Login to CBS</h1>
          <p className="text-gray-400 text-center">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-black/40 p-8 rounded-lg backdrop-blur-md border border-gray-800/50">
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
              />
            </div>
          </div>
          
          {error && <div className="text-red-500 text-center">{error}</div>}
          
          <Button type="submit" className="w-full bg-white text-gray-900 hover:bg-black hover:text-white">
            Login
          </Button>

          <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-gray-800 after:h-px after:flex-1 after:bg-gray-800">
            <span className="text-xs text-gray-500">Or</span>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full bg-white border-gray-800 text-gray-900 hover:bg-black hover:text-white"
            onClick={() => router.push('/register')}
          >
            Sign up
          </Button>

          <p className="text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-gray-300 underline hover:no-underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}