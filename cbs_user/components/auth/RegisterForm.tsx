'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from 'next/link';
import { RegisterData } from '@/lib/types/auth';
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().optional(),
});

export default function RegisterForm() {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    name: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      toast.success('Registration successful!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast.error(message);
      if (message.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: message }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-200">Full Name</Label>
          <Input 
            id="name"
            name="name"
            placeholder="Enter your full name" 
            type="text" 
            value={formData.name}
            onChange={handleChange}
            required 
            className={`border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              errors.name ? 'border-red-500' : ''
            }`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">Email</Label>
          <Input 
            id="email"
            name="email"
            placeholder="Enter your email" 
            type="email" 
            value={formData.email}
            onChange={handleChange}
            required 
            className={`border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              errors.email ? 'border-red-500' : ''
            }`}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              errors.password ? 'border-red-500' : ''
            }`}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-gray-200">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Enter your phone number"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              errors.phoneNumber ? 'border-red-500' : ''
            }`}
            disabled={isLoading}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-white text-gray-900 hover:bg-black hover:text-white"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Sign up'}
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
        <Link href="/login">Login</Link>
      </Button>

      <p className="text-center text-xs text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-gray-300 underline hover:no-underline">
          Login
        </Link>
      </p>
    </form>
  );
} 