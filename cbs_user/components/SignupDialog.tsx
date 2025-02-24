'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FiArrowRight } from "react-icons/fi";

interface SignupDialogProps {
  className?: string;
}

export default function SignupDialog({ className }: SignupDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      router.push('/dashboard');
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            Sign up
            <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:-rotate-45" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-gray-950 border border-gray-800">
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center text-white">Sign up to CBS</DialogTitle>
            <DialogDescription className="sm:text-center text-gray-400">
              We just need a few details to get you started.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Full name</Label>
              <Input 
                id="name" 
                placeholder="Enter your full name" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
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
            Sign up
          </Button>

          <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-gray-800 after:h-px after:flex-1 after:bg-gray-800">
            <span className="text-xs text-gray-500">Or</span>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full bg-white border-gray-800 text-gray-900 hover:bg-black hover:text-white"
            onClick={() => router.push('/login')}
          >
            Login
          </Button>

          <p className="text-center text-xs text-gray-500">
            By signing up you agree to our{" "}
            <a className="text-gray-300 underline hover:no-underline" href="#">
              Terms
            </a>
            .
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}