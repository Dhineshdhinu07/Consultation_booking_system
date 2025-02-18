"use client";

import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { PinContainer } from "@/components/ui/3d-pin";


export default function Home() {
  return (
    <section
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center">
        <PinContainer
        title="Book Now"
        href="/book-now"
        className="flex flex-col items-center justify-center bg-transparent"
        >
        <h1 className="max-w-3xl my-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-bold leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight font-bebas">
          Welcome to <br /> Consultation Booking System
        </h1>
        <button
          className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
        >
          Book Now
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </button>
        </PinContainer>
      </div>

      {/* <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div> */}
    </section>
  );
};