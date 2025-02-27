'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Owner",
    content: "SmartConsult made it incredibly easy to find the right expert for my business needs. The consultation was invaluable!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Startup Founder",
    content: "The platform's matching system is spot-on. I got exactly the expertise I needed, when I needed it.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    content: "Flexible scheduling and expert knowledge made my consultation experience seamless and productive.",
    rating: 5
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#F8F9FA] to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#007BFF] to-[#008080] bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what professionals like you have experienced with SmartConsult.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-[#007BFF] dark:text-[#008080] fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{testimonial.content}</p>
              <div className="border-t dark:border-gray-700 pt-4">
                <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 