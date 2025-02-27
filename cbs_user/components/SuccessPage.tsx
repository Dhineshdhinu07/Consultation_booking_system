'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
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
  meetingLink?: string;
  onCopyLink?: (link: string) => void;
}

export default function SuccessPage({
  amount,
  paymentId,
  bookedAt,
  meetingLink,
  onCopyLink
}: SuccessPageProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F9FA] to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-[#007BFF]/5 dark:bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <motion.div 
        className="relative z-10 w-full max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment Successful!
            </h2>

            <div className="space-y-3 text-left">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount Paid</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{amount}</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment ID</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{paymentId}</p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">Booked At</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{bookedAt}</p>
              </div>

              {meetingLink && (
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Meeting Link</p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={meetingLink}
                      readOnly
                      className="flex-1 text-sm bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onCopyLink?.(meetingLink)}
                      className="shrink-0 h-9 w-9 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => window.open(meetingLink, '_blank')}
                      className="shrink-0 h-9 w-9 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    Click the copy button to copy the meeting link or open link button to join directly
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <Button 
                asChild
                className="w-full bg-[#007BFF] hover:bg-[#008080] text-white dark:bg-[#008080] dark:hover:bg-[#007BFF]"
              >
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="w-full border-[#007BFF] text-[#007BFF] dark:border-[#008080] dark:text-[#008080] hover:bg-[#007BFF] hover:text-white dark:hover:bg-[#008080] dark:hover:text-white"
                asChild
              >
                <Link href="/booking">
                  Book Another Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 