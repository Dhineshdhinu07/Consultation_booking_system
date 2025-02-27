'use client';

import { motion } from 'framer-motion';
import { Search, Calendar, Video, MessageSquare } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: "Find Your Expert",
    description: "Browse through our curated list of verified experts and find the perfect match for your needs."
  },
  {
    icon: Calendar,
    title: "Schedule a Time",
    description: "Choose a convenient time slot that works for both you and the expert. Make sure to check the availability."
  },
  {
    icon: Video,
    title: "Join Consultation",
    description: "Connect with your expert through our secure video platform for your consultation."
  },
  {
    icon: MessageSquare,
    title: "Follow-up Support",
    description: "Get post-consultation support and follow-up resources to implement the advice."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1
  }
};

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#007BFF] to-[#008080] bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get expert consultation in four simple steps. Our streamlined process ensures you get the help you need, when you need it.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="mb-4 inline-block p-3 bg-[#007BFF]/10 dark:bg-[#007BFF]/20 rounded-lg">
                  <step.icon className="w-6 h-6 text-[#007BFF] dark:text-[#008080]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 w-full h-0.5 bg-gray-100 dark:bg-gray-700 -z-10 transform translate-x-1/2">
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#007BFF] dark:bg-[#008080]" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 