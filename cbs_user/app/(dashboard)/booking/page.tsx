'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { FileUpload } from "@/components/ui/file-upload"
import { BackgroundBeams } from "@/components/ui/background-beams"
import axios from "axios"
import { load } from '@cashfreepayments/cashfree-js'
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { v4 as uuidv4 } from 'uuid'

const formSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormValues = z.infer<typeof formSchema>

// Constants
const CONSULTATION_PRICE = 999; // Price in INR
const TEST_PHONE = "9876543210"; // Test phone number
const API_BASE_URL = "http://127.0.0.1:8787"; // Base URL for API calls

// Add type definition for Cashfree window object
declare global {
  interface Window {
    Cashfree: any;
  }
}

// Add type definition for API responses
interface PaymentSessionResponse {
  payment_session_id: string;
  success: boolean;
  message?: string;
}

interface PaymentVerificationResponse {
  success: boolean;
  status: string;
  message: string;
  order_id: string;
}

interface PaymentError {
  code?: string;
  message: string;
  type?: string;
}

// Validate API Response
const isValidJsonResponse = (response: Response): Promise<boolean> => {
  const contentType = response.headers.get('content-type');
  return Promise.resolve(contentType?.includes('application/json') ?? false);
};

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Initialize Cashfree SDK
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if script is already in document
      if (!document.querySelector("script[src='https://sdk.cashfree.com/js/v3/cashfree.js']")) {
        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.async = true;
        script.onload = () => {
          if (window.Cashfree) {
            const cashfreeInstance = new window.Cashfree({ mode: "sandbox" });
            setCashfree(cashfreeInstance);
          } else {
            console.error("Cashfree SDK did not initialize properly");
          }
        };
        script.onerror = (error) => {
          console.error("Error loading Cashfree SDK:", error);
        };
        document.body.appendChild(script);
      } else {
        if (window.Cashfree) {
          const cashfreeInstance = new window.Cashfree({ mode: "sandbox" });
          setCashfree(cashfreeInstance);
        }
      }
    }
  }, []);

  // Get session ID from backend with improved error handling
  const getSessionId = async (orderData: any): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const isJson = await isValidJsonResponse(response);
      if (!isJson) {
        throw new Error('Server returned non-JSON response');
      }

      const data: PaymentSessionResponse = await response.json();
      console.log("Payment session response:", data);

      if (data.success && data.payment_session_id) {
        return data.payment_session_id;
      }

      throw new Error(data.message || "Failed to get payment session ID");
    } catch (error) {
      console.error("Error getting session id:", error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to payment server. Please check your internet connection.');
        }
        throw new Error(`Payment initialization failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during payment initialization');
    }
  };

  // Verify payment status with improved error handling
  const verifyPayment = async (orderId: string): Promise<PaymentVerificationResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const isJson = await isValidJsonResponse(response);
      if (!isJson) {
        throw new Error('Server returned non-JSON response');
      }

      const data: PaymentVerificationResponse = await response.json();
      
      if (!data || typeof data.success !== 'boolean') {
        throw new Error('Invalid verification response format');
      }

      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to verification server. Please check your internet connection.');
        }
        throw new Error(`Payment verification failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during payment verification');
    }
  };

  const handlePaymentRetry = () => {
    setPaymentError(null);
    setIsSubmitting(false);
    // Re-enable the form for retry
    form.reset(form.getValues());
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setPaymentError(null);

      if (!cashfree) {
        const error = { 
          message: "Payment system not initialized. Please try again.",
          type: "INITIALIZATION_ERROR"
        };
        setPaymentError(error);
        toast.error(error.message);
        return;
      }

      // Generate order ID
      const orderId = 'ORDER_' + Math.random().toString(36).substr(2, 9);

      // Prepare order data
      const orderData = {
        order_id: orderId,
        order_amount: CONSULTATION_PRICE,
        order_currency: "INR",
        customer_details: {
          customer_id: user?.id || "GUEST_" + Math.random().toString(36).substr(2, 9),
          customer_name: values.name,
          customer_email: values.email,
          customer_phone: TEST_PHONE
        }
      };

      // Get session ID with error handling
      let sessionId;
      try {
        sessionId = await getSessionId(orderData);
        console.log("Received session ID:", sessionId);
      } catch (error) {
        const paymentError = {
          message: error instanceof Error ? error.message : "Failed to initialize payment",
          type: "SESSION_ERROR"
        };
        setPaymentError(paymentError);
        toast.error(paymentError.message);
        return;
      }

      // Initialize payment
      try {
        const checkoutOptions = {
          paymentSessionId: sessionId,
          returnUrl: `${window.location.origin}/payment-status/${orderId}`,
        };

        // Start checkout process
        const result = await cashfree.checkout(checkoutOptions);
        
        if (result.error) {
          const error = {
            code: result.error.code,
            message: result.error.message || "Payment failed. Please try again.",
            type: "CHECKOUT_ERROR"
          };
          setPaymentError(error);
          console.error("Payment error:", error);
          toast.error(error.message);
          return;
        }

        if (result.success) {
          console.log("Payment initiated successfully");
          
          // Verify payment status with improved error handling
          try {
            const verificationResult = await verifyPayment(orderId);
            
            if (verificationResult.success && verificationResult.status === "PAID") {
              toast.success("Payment successful!");
              window.location.href = "/dashboard";
            } else {
              const error = {
                message: verificationResult.message || "Payment verification failed. Please try again or contact support.",
                type: "VERIFICATION_ERROR"
              };
              setPaymentError(error);
              console.error("Payment verification failed:", verificationResult);
              toast.error(error.message);
            }
          } catch (verifyError) {
            const error = {
              message: verifyError instanceof Error ? verifyError.message : "Could not verify payment status",
              type: "VERIFICATION_ERROR"
            };
            setPaymentError(error);
            console.error("Error verifying payment:", verifyError);
            toast.error(error.message);
          }
        }

      } catch (error) {
        const paymentError = {
          message: error instanceof Error ? error.message : "Failed to process payment",
          type: "INITIALIZATION_ERROR"
        };
        setPaymentError(paymentError);
        console.error("Payment initialization error:", error);
        toast.error(paymentError.message);
      }

    } catch (error) {
      const finalError = {
        message: error instanceof Error ? error.message : "Payment initialization failed",
        type: "GENERAL_ERROR"
      };
      setPaymentError(finalError);
      console.error("Payment processing error:", error);
      toast.error(finalError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative bg-gray-950 w-full min-h-screen flex justify-center items-center text-white p-4">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>

      {/* Content layer */}
      <div className="relative z-10 w-full max-w-md space-y-8 rounded-xl border bg-gray-950/50 border-gray-800 p-6 backdrop-blur-sm">
        {paymentError ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Payment Failed</h2>
            <p className="text-gray-400">
              {paymentError.message}
            </p>
            <div className="flex flex-col gap-4">
              <Button
                onClick={handlePaymentRetry}
                className="w-full bg-white text-black hover:text-white"
              >
                Try Again
              </Button>
              <Link href="/" className="w-full">
                <Button type="button" className="w-full bg-white text-black hover:text-white">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold">Book Consultation</h1>
              <p className="text-gray-400">Fill in the details to schedule your consultation.</p>
              <p className="text-lg font-semibold mt-2">Consultation Fee: ₹{CONSULTATION_PRICE}</p>
              {!user && (
                <p className="text-yellow-400 mt-2">
                  Note: You are booking as a guest. Consider{" "}
                  <Link href="/login" className="underline hover:no-underline">
                    logging in
                  </Link>
                  {" "}for a better experience.
                </p>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Name" 
                          {...field} 
                          className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Email" 
                          {...field} 
                          className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-white text-black hover:text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Book Consultation"}
                  </Button>
                  <Link href="/" className="w-full">
                    <Button type="button" className="w-full bg-white text-black hover:text-white">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </section>
  )
}