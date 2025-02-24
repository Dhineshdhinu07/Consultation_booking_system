import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface NavItem {
  name: string;
  link: string;
  icon?: ReactNode;
  alternateText?: string;
}

interface FloatingNavProps {
  navItems: NavItem[];
  className?: string;
  authButton?: ReactNode;
}

const FloatingNav = ({ navItems, className, authButton }: FloatingNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 inset-x-0 mx-auto z-50 flex justify-center items-center gap-4">
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <nav className="flex items-center justify-center space-x-4 bg-black border border-gray-800 px-8 py-2 rounded-full">
          {navItems.map((item, idx) => (
            <div key={item.name} className="relative group">
              <Link
                href={item.link}
                className="relative flex items-center space-x-1 text-neutral-300 hover:text-neutral-100 transition-colors duration-200"
              >
                <span className="hidden sm:block">{item.name}</span>
                {item.icon}
              </Link>
              {item.alternateText && (
                <span className="absolute hidden group-hover:block bg-black text-white text-sm py-1 px-2 rounded -bottom-8 left-1/2 transform -translate-x-1/2">
                  {item.alternateText}
                </span>
              )}
            </div>
          ))}
        </nav>
      </motion.div>

      {authButton && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {authButton}
        </motion.div>
      )}
    </div>
  );
};

export default FloatingNav; 