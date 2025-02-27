'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F9FA] to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-[#007BFF]/5 dark:bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Gateway to{' '}
            <span className="bg-gradient-to-r from-[#007BFF] to-[#008080] bg-clip-text text-transparent">
              Expert Advice
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Connect with verified experts for personalized consultations. Book your session today and get the guidance you need.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              onClick={() => router.push('/booking')}
              size="lg"
              className="bg-[#007BFF] hover:bg-[#008080] text-white dark:bg-[#008080] dark:hover:bg-[#007BFF] px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Book a Consultation Now
            </Button>
            <Button
              onClick={() => router.push('/services')}
              size="lg"
              variant="outline"
              className="border-[#007BFF] text-[#007BFF] dark:border-[#008080] dark:text-[#008080] hover:bg-[#007BFF] hover:text-white dark:hover:bg-[#008080] dark:hover:text-white px-8 py-6 text-lg rounded-full"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>

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
    </div>
  );
} 