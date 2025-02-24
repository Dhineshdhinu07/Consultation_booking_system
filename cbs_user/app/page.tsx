"use client";

import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { PinContainer } from "@/components/ui/3d-pin";
import Link from "next/link";
import { FiHome, FiUser, FiLogIn } from "react-icons/fi";
import FloatingNav from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import SignupDialog from "@/components/SignupDialog";
import LoginDialog from "@/components/LoginDialog";

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
    name: "Dashboard",
    alternateText: "Dashboard",
    link: "/dashboard",
    icon: <FiHome className="h-4 w-4" />,
  },
  {
    name: "Login",
    alternateText: "Login",
    component: <LoginDialog />,
    isAuthButton: true
  },
];

export default function Home() {
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

      <FloatingNav navItems={navItems} />
        
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
          <SignupDialog />

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
    </section>
  );
}