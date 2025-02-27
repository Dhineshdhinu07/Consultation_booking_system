"use client";

import React, { useState, useEffect } from 'react';
import { FiHome, FiUser, FiLogOut, FiEdit2, FiSearch, FiFilter, FiTrash2, FiGrid } from "react-icons/fi";
import FloatingNav from "@/components/ui/floating-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const navItems = [
  {
    name: "Home",
    alternateText: "Home",
    link: "/",
    icon: <FiHome className="h-4 w-4" />,
  },
  {
    name: "Profile",
    alternateText: "Profile",
    link: "/profile",
    icon: <FiUser className="h-4 w-4" />,
  },
  {
    name: "Book Now",
    alternateText: "Book Now",
    link: "/booking",
    icon: <FiUser className="h-4 w-4" />,
  },
  {
    name: "Dashboard",
    alternateText: "Dashboard",
    link: "/dashboard",
    icon: <FiGrid className="h-4 w-4" />,
  },
  {
    name: "Logout",
    alternateText: "Logout",
    icon: <FiLogOut className="h-4 w-4" />,
  },
];

const ITEMS_PER_PAGE = 5;

interface Booking {
  id: number;
  date: string;
  time: string;
  status: "Completed" | "Upcoming" | "Cancelled";
  type: string;
}



const ProfilePage = () => {
  
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-24  text-gray-200">
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-overlay" />
      
      <div 
        className="absolute inset-0 opacity-20" />

      <FloatingNav navItems={navItems} />

      <div className="relative z-10 container mx-auto max-w-6xl space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)] pb-6">
        {/* User Profile Card */}
        <Card className="bg-gray-950/50 border-gray-800 text-white backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">Dhinesh M</CardTitle>
                <CardDescription className="text-gray-400">dhinesh@gmail.com</CardDescription>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-transparent border-gray-800 text-white hover:bg-gray-800">
                  <FiEdit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-950 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Full Name</Label>
                    <Input 
                      defaultValue="Dhinesh M"
                      className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200">Email</Label>
                    <Input 
                      type="email" 
                      defaultValue="dhinesh@gmail.com"
                      className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12"
                    />
                  </div>
                  <Button className="w-full bg-white text-gray-900 hover:bg-black hover:text-white border-gray-800">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>

        {/* Change Password Card */}
        <Card className="bg-gray-950/50 border-gray-800 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription className="text-gray-400">Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Current Password</Label>
              <Input 
                type="password" 
                placeholder="Enter current password" 
                className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">New Password</Label>
              <Input 
                type="password" 
                placeholder="Enter new password" 
                className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12"
              />
            </div>
            <Button className="bg-white text-gray-900 hover:bg-black hover:text-white border-gray-800">
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Booking History Card */}
        
      </div>
    </section>
  );
};

export default ProfilePage;