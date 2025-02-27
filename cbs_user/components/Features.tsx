'use client';

import { motion } from 'framer-motion';
import { Calendar, Shield, CreditCard, Clock, Users, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book appointments with just a few clicks. Choose your preferred time and expert.',
  },
  {
    icon: Shield,
    title: 'Verified Experts',
    description: 'All our consultants are thoroughly vetted and certified in their respective fields.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Your transactions are protected with bank-grade security and encryption.',
  },
  {
    icon: Clock,
    title: 'Flexible Timing',
    description: 'Find slots that work for you with our 24/7 booking system.',
  },
  {
    icon: Users,
    title: 'Expert Matching',
    description: 'Get matched with the right expert based on your specific needs.',
  },
  {
    icon: MessageSquare,
    title: 'Instant Support',
    description: '24/7 customer support to assist you with any queries or concerns.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Features() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-[#007BFF] to-[#008080] bg-clip-text text-transparent">
              SmartConsult
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the best-in-class consultation platform with features designed for your success.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative group"
              variants={itemVariants}
            >
              <div className="h-full p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-[#007BFF]/10 dark:bg-[#007BFF]/20 text-[#007BFF] group-hover:bg-[#007BFF] group-hover:text-white transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 