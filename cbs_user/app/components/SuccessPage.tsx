'use client';

import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from 'next/link';
import { motion } from "framer-motion";
import confetti from 'canvas-confetti';

interface SuccessPageProps {
  amount: number;
  paymentId: string;
  bookedAt: string;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ amount, paymentId, bookedAt }) => {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gray-950 w-full min-h-screen flex justify-center items-center text-white p-4">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>

      {/* Content layer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md space-y-8 rounded-xl border bg-gray-950/50 border-gray-800 p-8 backdrop-blur-sm"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500 rounded-full p-4">
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1 
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="white"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white">Booking Successful!</h1>
          <p className="text-gray-400">
            Your consultation has been successfully booked
          </p>

          <div className="space-y-4 mt-6 p-6 rounded-lg bg-black/30 border border-gray-800">
            <div className="space-y-2">
              <p className="text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-white">₹{amount}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-400">Payment ID</p>
              <p className="text-lg font-medium text-white">{paymentId}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-400">Booked At</p>
              <p className="text-lg font-medium text-white">{bookedAt}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <Button 
              className="w-full bg-white text-black hover:bg-white hover:text-black border-gray-800"
              asChild
            >
              <Link href="/dashboard">
                Fill the Form
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SuccessPage; 