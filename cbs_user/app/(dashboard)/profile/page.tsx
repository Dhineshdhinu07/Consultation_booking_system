"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import { useAuth } from "@/components/auth-provider";
import AuthService from "@/lib/services/auth.service";
import { z } from "zod";
import Navbar from "@/components/Navbar";

// Profile update schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().optional()
}).refine((data) => {
  if (data.newPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = profileSchema.parse(formData);
      
      // Call the actual update profile API
      await AuthService.updateProfile({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        currentPassword: validatedData.currentPassword,
        newPassword: validatedData.newPassword
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update profile. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white dark:from-gray-950 dark:to-gray-900 pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-[#007BFF]/5 dark:bg-grid-[#007BFF]/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#007BFF] to-[#008080] bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card className="md:col-span-1 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-gray-100 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Profile Summary</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#007BFF] to-[#008080] flex items-center justify-center">
                    <FiUser className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user?.name || "User"}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{user?.email || "user@example.com"}</p>
                  </div>
                  <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Member since</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">March 2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Form */}
            <Card className="md:col-span-2 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-gray-100 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Edit Profile</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <div className="relative mt-1">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent dark:text-gray-100"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <div className="relative mt-1">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent dark:text-gray-100"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <div className="relative mt-1">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="pl-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent dark:text-gray-100"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Change Password</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Password
                          </label>
                          <div className="relative mt-1">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className="pl-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent dark:text-gray-100"
                              placeholder="Enter current password"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password
                          </label>
                          <div className="relative mt-1">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="pl-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent dark:text-gray-100"
                              placeholder="Enter new password"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm New Password
                          </label>
                          <div className="relative mt-1">
                            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="pl-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent dark:text-gray-100"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setFormData({
                        name: user?.name || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      })}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#007BFF] to-[#008080] text-white hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}