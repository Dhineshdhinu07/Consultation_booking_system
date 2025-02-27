"use client";

import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { PinContainer } from "@/components/ui/3d-pin";
import Link from "next/link";
import { FiHome, FiUser, FiGrid } from "react-icons/fi";
import FloatingNav from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import SignupDialog from "@/components/SignupDialog";
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import HowItWorks from '@/components/HowItWorks';
import ContactCTA from '@/components/ContactCTA';

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
    icon: <FiGrid className="h-4 w-4" />,
  }
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-950">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <ContactCTA />
      </main>
    </>
  );
}