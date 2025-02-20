"use client";

import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { PinContainer } from "@/components/ui/3d-pin";
import Link from "next/link";
import { FiHome, FiUser, FiLogIn } from "react-icons/fi";
import FloatingNav from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const navItems = [
  {
    name: "Home",
    alternateText: "Home",
    link: "/",
    icon: <FiHome className="h-4 w-4" />,
  },
  {
    name: "Book Now",
    alternateText: "Book Now",
    link: "/booking",
    icon: <FiUser className="h-4 w-4" />,
  },
  {
    name: "Login",
    alternateText: "Login",
    link: "/login",
    icon: <FiLogIn className="h-4 w-4" />,
  },
];

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <section
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-24 text-gray-200"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-overlay" />
      
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <FloatingNav 
          navItems={navItems.map(item => 
            item.name === "Login" 
              ? {
                  ...item,
                  link: undefined,
                  onClick: () => setIsDialogOpen(true)
                } 
              : item
          )} 
        />
        
        <div className="relative z-10 flex flex-col items-center">
          <PinContainer
          title="Book Now"
          href="/booking"
          className="flex flex-col items-center justify-center bg-transparent"
          >
           <h1 className="max-w-3xl my-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-bold leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight font-bebas">
            Welcome to <br /> Consultation Booking System
           </h1>
          </PinContainer>

          <div className="flex items-center gap-4 mt-16">
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
                    <DialogTitle className="sm:text-center text-white">Sign up CBS</DialogTitle>
                    <DialogDescription className="sm:text-center text-gray-400">
                      We just need a few details to get you started.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <form className="space-y-5">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-200">Full name</Label>
                      <Input 
                        id="name" 
                        placeholder="Enter your full name" 
                        type="text" 
                        required 
                        className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700  h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Email</Label>
                      <Input 
                        id="email" 
                        placeholder="Enter your email" 
                        type="email" 
                        required 
                        className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700  h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-200">Password</Label>
                      <Input
                        id="password"
                        placeholder="Enter your password"
                        type="password"
                        required
                        className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700  h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white"
                      />
                    </div>
                  </div>
                  <Button type="button" className="w-full bg-white text-gray-900 hover:bg-black hover:text-white">
                    Sign up
                  </Button>
                </form>

                <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-gray-800 after:h-px after:flex-1 after:bg-gray-800">
                  <span className="text-xs text-gray-500">Or</span>
                </div>

                <Button variant="outline" className="bg-white border-gray-800 text-gray-900 hover:bg-black hover:text-white">
                  Login
                </Button>

                <p className="text-center text-xs text-gray-500">
                  By signing up you agree to our{" "}
                  <a className="text-gray-300 underline hover:no-underline" href="#">
                    Terms
                  </a>
                  .
                </p>
              </DialogContent>
            </Dialog>

            <button className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <Link href="/booking">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Book Now
                  <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:-rotate-45" />
                </span>
              </Link>
            </button>
          </div>
        </div>

        <div className="absolute inset-0 z-0 opacity-50">
          <BackgroundBeams />
        </div>
      </Dialog>
    </section>
  );
};