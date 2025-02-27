'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import SuccessPage from '@/components/SuccessPage';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';
import { api } from '@/lib/utils/api';

type PaymentStatus = 'loading' | 'success' | 'failed';

interface PaymentState {
  status: PaymentStatus;
  message: string;
  paymentDetails?: {
    amount: number;
    paymentId: string;
    bookedAt: string;
    meetingLink?: string;
  };
}

interface BookingData {
  orderId: string;
  amount: number;
  status: 'Confirmed';
  meetingLink: string;
  bookedAt: string;
}

export default function PaymentStatus() {
  const { user } = useAuth();
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: 'loading',
    message: 'Verifying your payment...'
  });
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const router = useRouter();

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Meeting link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const createBooking = async (bookingData: BookingData) => {
    try {
      await api.post('/bookings', bookingData);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8787/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ orderId: params.orderId })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Payment verification failed');
        }

        const result = await response.json();

        if (result.success && result.status === 'PAID') {
          // Generate a random Zoho meeting link
          const meetingId = Math.random().toString(36).substring(2, 10);
          const meetingLink = `https://meet.zoho.com/j/${meetingId}`;
          const bookedAt = new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
          });
          
          // Create booking record
          await createBooking({
            orderId: params.orderId as string,
            amount: result.amount || 500,
            status: 'Confirmed',
            meetingLink,
            bookedAt
          });
          
          setPaymentState({
            status: 'success',
            message: 'Payment successful!',
            paymentDetails: {
              amount: result.amount || 500,
              paymentId: result.paymentId || params.orderId,
              bookedAt,
              meetingLink
            }
          });
        } else {
          setPaymentState({
            status: 'failed',
            message: result.message || 'Payment verification failed. Please try again.'
          });
          toast.error('Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setPaymentState({
          status: 'failed',
          message: 'Unable to verify payment. Please contact support if payment was deducted.'
        });
        toast.error('Failed to verify payment');
      }
    };

    verifyPayment();
  }, [params.orderId, router]);

  if (paymentState.status === 'success' && paymentState.paymentDetails) {
    return (
      <SuccessPage
        amount={paymentState.paymentDetails.amount}
        paymentId={paymentState.paymentDetails.paymentId}
        bookedAt={paymentState.paymentDetails.bookedAt}
        meetingLink={paymentState.paymentDetails.meetingLink}
        onCopyLink={handleCopyLink}
      />
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F9FA] to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-[#007BFF]/5 dark:bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 left-10 w-20 h-20 bg-[#007BFF]/10 rounded-full"
        animate={{
          y: [0, 20, 0],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-32 h-32 bg-[#008080]/10 rounded-full"
        animate={{
          y: [0, -30, 0],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Content */}
      <motion.div 
        className="relative z-10 w-full max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="text-center space-y-4">
            {/* Status Icon */}
            <div className="flex justify-center mb-6">
              {paymentState.status === 'loading' && (
                <Loader2 className="h-12 w-12 animate-spin text-[#007BFF] dark:text-[#008080]" />
              )}
              {paymentState.status === 'failed' && (
                <XCircle className="h-12 w-12 text-red-500" />
              )}
            </div>

            {/* Status Header */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {paymentState.status === 'loading' && 'Verifying Payment'}
              {paymentState.status === 'failed' && 'Payment Failed'}
            </h2>

            {/* Status Message */}
            <p className={cn(
              "text-sm",
              paymentState.status === 'failed' 
                ? "text-red-600 dark:text-red-400" 
                : "text-gray-600 dark:text-gray-300"
            )}>
              {paymentState.status === 'failed' 
                ? 'Payment verification failed. Please try again.' 
                : paymentState.message}
            </p>

            {/* Action Buttons */}
            {paymentState.status === 'failed' && (
              <div className="flex flex-col gap-4 mt-6">
                <Button 
                  asChild
                  className="w-full bg-[#007BFF] hover:bg-[#008080] text-white dark:bg-[#008080] dark:hover:bg-[#007BFF]"
                >
                  <Link href="/booking">
                    Try Again
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-[#007BFF] text-[#007BFF] dark:border-[#008080] dark:text-[#008080] hover:bg-[#007BFF] hover:text-white dark:hover:bg-[#008080] dark:hover:text-white"
                  asChild
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
            )}
            {paymentState.status === 'loading' && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please don't close this window while we verify your payment
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 