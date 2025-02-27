'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from 'next/link';
import { Loader2 } from "lucide-react";
import SuccessPage from '@/app/components/SuccessPage';

type PaymentStatus = 'loading' | 'success' | 'failed';

interface PaymentState {
  status: PaymentStatus;
  message: string;
  paymentDetails?: {
    amount: number;
    paymentId: string;
    bookedAt: string;
  };
}

export default function PaymentStatus() {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    status: 'loading',
    message: 'Verifying your payment...'
  });
  const params = useParams();
  const router = useRouter();

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
          throw new Error('Verification request failed');
        }

        const result = await response.json();

        if (result.success && result.status === 'PAID') {
          setPaymentState({
            status: 'success',
            message: 'Payment successful!',
            paymentDetails: {
              amount: result.amount || 500, // Default to 500 if not provided
              paymentId: result.paymentId || params.orderId,
              bookedAt: new Date().toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })
            }
          });
          toast.success('Payment verified successfully!');
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
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-overlay" />
      <div className="absolute inset-0">
        <BackgroundBeams />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-xl border bg-gray-950/50 border-gray-800 p-8 backdrop-blur-sm space-y-6">
          <div className="text-center space-y-4">
            {/* Status Header */}
            <h2 className="text-2xl font-bold text-white">
              {paymentState.status === 'loading' && 'Verifying Payment'}
              {paymentState.status === 'failed' && 'Payment Failed'}
            </h2>

            {/* Status Message */}
            <p className="text-gray-400">
              {paymentState.message}
            </p>

            {/* Loading Spinner */}
            {paymentState.status === 'loading' && (
              <div className="flex justify-center my-6">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}

            {/* Action Buttons */}
            {paymentState.status === 'failed' && (
              <div className="flex flex-col gap-4 mt-6">
                <Button 
                  asChild
                  className="w-full bg-white text-black hover:text-white"
                >
                  <Link href="/booking">
                    Try Again
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-gray-800 text-white hover:bg-gray-800"
                  asChild
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
            )}
            {paymentState.status === 'loading' && (
              <p className="text-sm text-gray-500">
                Please don't close this window while we verify your payment
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 