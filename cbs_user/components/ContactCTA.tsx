'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#007BFF]/5 to-[#008080]/5" id="contact">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#007BFF] to-[#008080] bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of professionals who trust SmartConsult for expert guidance. 
            Book your consultation today and take the first step towards success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/booking"
              className="inline-flex items-center px-6 py-3 rounded-full bg-[#007BFF] text-white font-semibold hover:bg-[#008080] transition-colors duration-200"
            >
              Book a Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-full border-2 border-[#007BFF]/20 text-[#007BFF] font-semibold hover:bg-[#007BFF]/5 transition-colors duration-200"
            >
              Contact Support
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#007BFF] mb-2">24/7</h3>
              <p className="text-gray-600">Support Available</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#007BFF] mb-2">100+</h3>
              <p className="text-gray-600">Expert Consultants</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[#007BFF] mb-2">95%</h3>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 