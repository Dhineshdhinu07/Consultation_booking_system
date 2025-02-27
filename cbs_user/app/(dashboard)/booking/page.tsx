'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, 
  Clock, CreditCard, Calendar as CalendarIcon,
  Briefcase, Home, Coins, Bitcoin, Calculator,
  Users, Globe, FileText, TrendingUp
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  price: number;
  icon: any;
  description: string;
}

const services: Service[] = [
  { 
    id: 'salary', 
    name: 'Salary / House Rent / Pension', 
    price: 500,
    icon: Home,
    description: 'Expert consultation for salary structure, HRA, and pension planning'
  },
  { 
    id: 'capital-gains-securities', 
    name: 'Capital Gains (Securities)', 
    price: 500,
    icon: TrendingUp,
    description: 'Guidance on securities taxation, STCG/LTCG, and exemptions'
  },
  { 
    id: 'capital-gains-real-estate', 
    name: 'Capital Gains (Real Estate)', 
    price: 500,
    icon: Briefcase,
    description: 'Real estate taxation advice and reinvestment strategies'
  },
  { 
    id: 'cryptocurrency', 
    name: 'Cryptocurrency', 
    price: 500,
    icon: Bitcoin,
    description: 'Tax implications of crypto trading and investments'
  },
  { 
    id: 'presumptive', 
    name: 'Presumptive Taxation', 
    price: 500,
    icon: Calculator,
    description: 'Consultation on presumptive taxation schemes'
  },
  { 
    id: 'business', 
    name: 'Business Owners / Professionals', 
    price: 500,
    icon: Users,
    description: 'Tax planning for businesses and professionals'
  },
  { 
    id: 'nri', 
    name: 'NRI Taxation', 
    price: 500,
    icon: Globe,
    description: 'Tax consultation for Non-Resident Indians'
  },
  { 
    id: 'notices', 
    name: 'Review of Income Tax Notices', 
    price: 500,
    icon: FileText,
    description: 'Expert review and guidance on tax notices'
  },
  { 
    id: 'futures', 
    name: 'Futures and Options (F&O)', 
    price: 500,
    icon: Coins,
    description: 'F&O trading taxation and compliance'
  },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [step, setStep] = useState<'service' | 'datetime' | 'payment'>('service');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedServiceDetails = services.find(s => s.id === selectedService);

  const steps = [
    { id: 'service', title: 'Select Service', icon: Briefcase },
    { id: 'datetime', title: 'Choose Date & Time', icon: CalendarIcon },
    { id: 'payment', title: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Vertical Stepper */}
        <div className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-2">
            {steps.map((s, index) => {
              const isActive = s.id === step;
              const isPast = steps.findIndex(x => x.id === step) > index;
              return (
                <div key={s.id} className="relative">
                  <div className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                    isActive ? 'bg-gray-50 dark:bg-[#1C1C1E] shadow-lg' :
                    isPast ? 'text-[#007BFF] dark:text-[#60A5FA]' :
                    'text-gray-400 dark:text-gray-500'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#60A5FA] dark:to-[#3B82F6] text-white' :
                      isPast ? 'bg-blue-50 text-[#007BFF] dark:bg-blue-900/20 dark:text-[#60A5FA]' :
                      'bg-gray-100 dark:bg-[#1C1C1E] text-gray-400 dark:text-gray-500'
                    }`}>
                      <s.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{s.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute left-7 top-[60px] w-[2px] h-[40px] bg-gray-100 dark:bg-[#1C1C1E]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          {/* Service Selection */}
          {step === 'service' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {services.map((service) => {
                const isSelected = selectedService === service.id;
                const ServiceIcon = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative cursor-pointer rounded-xl p-6 transition-all ${
                      isSelected 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-[#007BFF] dark:border-[#60A5FA]'
                        : 'bg-white dark:bg-[#1C1C1E] hover:shadow-xl border border-gray-200 dark:border-[#2C2C2E]'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#60A5FA] dark:to-[#3B82F6] text-white'
                          : 'bg-gray-100 dark:bg-[#2C2C2E] text-gray-500 dark:text-gray-400'
                      }`}>
                        <ServiceIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {service.description}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-[#007BFF] dark:text-[#60A5FA]">
                          ₹{service.price}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-[#007BFF] dark:bg-[#60A5FA] rounded-full flex items-center justify-center text-white"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Date & Time Selection */}
          {step === 'datetime' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1C1C1E] rounded-xl p-6 shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg [&_.rdp-months]:bg-white dark:[&_.rdp-months]:bg-[#1C1C1E] [&_.rdp-month]:bg-white dark:[&_.rdp-month]:bg-[#1C1C1E] [&_.rdp-table]:bg-white dark:[&_.rdp-table]:bg-[#1C1C1E] [&_.rdp-cell]:p-0 [&_.rdp-button]:bg-transparent [&_.rdp-button:hover]:bg-gray-100 dark:[&_.rdp-button:hover]:bg-[#2C2C2E] [&_.rdp-button]:border-0 [&_.rdp-day_button]:rounded-full [&_.rdp-day_button]:transition-all [&_.rdp-day_button]:duration-200 [&_.rdp-day_selected]:!bg-[#007BFF] dark:[&_.rdp-day_selected]:!bg-[#60A5FA] [&_.rdp-day_selected]:text-white [&_.rdp-day_selected]:font-bold [&_.rdp-day_selected]:hover:bg-[#0056b3] dark:[&_.rdp-day_selected]:hover:bg-[#3B82F6] [&_.rdp-nav_button]:hover:bg-transparent [&_.rdp-nav_button]:text-gray-600 dark:[&_.rdp-nav_button]:text-gray-300 [&_.rdp-caption_label]:text-gray-900 dark:[&_.rdp-caption_label]:text-white [&_.rdp-head_cell]:text-gray-600 dark:[&_.rdp-head_cell]:text-gray-400 [&_.rdp-button_reset]:text-gray-600 dark:[&_.rdp-button_reset]:text-gray-300"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Time</h3>
                  <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-200 dark:border-[#2C2C2E]">
                    <div className="flex p-4">
                      {timeSlots.map((time) => (
                        <motion.button
                          key={time}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedTime(time)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg mr-3 transition-all ${
                            selectedTime === time
                              ? 'bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#60A5FA] dark:to-[#3B82F6] text-white'
                              : 'bg-gray-100 dark:bg-[#2C2C2E] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3C3C3E]'
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                          {time}
                        </motion.button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment */}
          {step === 'payment' && selectedServiceDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1C1C1E] rounded-xl p-6 shadow-lg"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6 border border-[#007BFF]/20 dark:border-[#60A5FA]/20">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Booking Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {selectedServiceDetails.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                      <p className="text-xl font-bold text-[#007BFF] dark:text-[#60A5FA]">
                        ₹{selectedServiceDetails.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {date?.toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {selectedTime && ` at ${selectedTime}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/payment">
               <Button className="w-full bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#60A5FA] dark:to-[#3B82F6] hover:from-[#0056b3] hover:to-[#004094] dark:hover:from-[#3B82F6] dark:hover:to-[#2563EB] text-white">
                 Proceed to Payment
               </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-8 right-8 flex gap-4"
      >
        {step !== 'service' && (
          <Button
            onClick={() => {
              if (step === 'datetime') setStep('service');
              else if (step === 'payment') setStep('datetime');
            }}
            className="h-14 px-6 rounded-full bg-gray-100 dark:bg-[#2C2C2E] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3C3C3E] shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        )}
        {((step === 'service' && selectedService) ||
          (step === 'datetime' && date && selectedTime)) && (
          <Button
            onClick={() => {
              if (step === 'service') setStep('datetime');
              else if (step === 'datetime') setStep('payment');
            }}
            className="h-14 px-6 rounded-full bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#60A5FA] dark:to-[#3B82F6] hover:from-[#0056b3] hover:to-[#004094] dark:hover:from-[#3B82F6] dark:hover:to-[#2563EB] text-white shadow-lg"
          >
            Next Step
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </motion.div>
    </div>
  );
} 