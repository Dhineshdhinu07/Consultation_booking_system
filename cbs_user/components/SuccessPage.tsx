'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Confetti from 'react-confetti';
import { useEffect, useState } from "react";
import { useWindowSize } from 'react-use';
import { toast } from 'sonner';

interface SuccessPageProps {
  amount: number;
  paymentId: string;
  bookedAt: string;
}

export default function SuccessPage({ amount, paymentId, bookedAt }: SuccessPageProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#F8F9FA] to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-lg">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/20 p-3">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Successful!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your consultation has been successfully booked
              </p>
            </div>

            {/* Payment Details */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{amount}</p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">Payment ID</p>
                <p className="font-mono text-gray-900 dark:text-white">{paymentId}</p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">Booked At</p>
                <p className="text-gray-900 dark:text-white">{bookedAt}</p>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              asChild
              className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white dark:bg-[#008080] dark:hover:bg-[#006666]"
            >
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 