"use client";

import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { PinContainer } from "@/components/ui/3d-pin";
import Link from "next/link";
import { FiHome, FiUser } from "react-icons/fi";
import FloatingNav from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";


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
    link: "/book-now",
    icon: <FiUser className="h-4 w-4" />,
  },
];

export default function Home() {
  return (
    <section
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <FloatingNav navItems={navItems} />
      <div className="relative z-10 flex flex-col items-center">
        <PinContainer
        title="Book Now"
        href="/book-now"
        className="flex flex-col items-center justify-center bg-transparent"
        >
         <h1 className="max-w-3xl my-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-bold leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight font-bebas">
          Welcome to <br /> Consultation Booking System
         </h1>
        </PinContainer>
        <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mt-8">
          <Link href="/book-now">
           <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Book Now
              <FiArrowRight className="ml-2 transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
            </span>
          </Link>
        </button>
      </div>

      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>
    </section>
  );
};