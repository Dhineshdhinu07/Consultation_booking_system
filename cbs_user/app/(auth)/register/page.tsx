'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { toast } from "sonner";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import { z } from 'zod';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number").optional().or(z.string().length(0))
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ 
    name?: string[];
    email?: string[];
    password?: string[]; 
    confirmPassword?: string[];
    general?: string;
    phoneNumber?: string[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const validateForm = () => {
    try {
      const formData = {
        name,
        email,
        password,
        confirmPassword,
        phoneNumber
      };
      
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { [key: string]: string[] } = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(err.message);
        });
        setErrors(formattedErrors);
        console.error("Validation errors:", formattedErrors);
      } else {
        console.error("Unknown validation error:", error);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    console.log("Form data before validation:", { name, email, password, confirmPassword, phoneNumber });

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        phoneNumber: phoneNumber.trim() || undefined
      };

      await register(registrationData);
      
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error?.message || 'Registration failed';
      if (errorMessage.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: [errorMessage] }));
      } else if (errorMessage.toLowerCase().includes('name')) {
        setErrors(prev => ({ ...prev, name: [errorMessage] }));
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors(prev => ({ ...prev, password: [errorMessage] }));
      } else {
        setErrors(prev => ({ ...prev, general: errorMessage }));
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-[#007BFF]/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#007BFF] to-[#008080] bg-clip-text text-transparent">
              SmartConsult
            </h1>
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-600">Join our community of professionals</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="name"
                  placeholder="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`pl-10 h-11 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-200'} bg-white/50 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent`}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
              )}

              {/* Phone Number Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="phoneNumber"
                  placeholder="Phone Number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`pl-10 h-11 rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'} bg-white/50 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent`}
                  disabled={isLoading}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber[0]}</p>
              )}

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 h-11 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-white/50 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent`}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
              )}

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 h-11 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-200'} bg-white/50 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <ul className="text-red-500 text-xs mt-1 space-y-1">
                  {errors.password.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}

              {/* Confirm Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 pr-10 h-11 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} bg-white/50 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword[0]}</p>
              )}
            </div>

            {errors.general && (
              <div className="text-red-500 text-sm text-center">{errors.general}</div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-[#007BFF] hover:bg-[#008080] text-white font-medium rounded-lg text-base transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-[#007BFF] hover:text-[#008080] font-medium transition-colors duration-200">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}