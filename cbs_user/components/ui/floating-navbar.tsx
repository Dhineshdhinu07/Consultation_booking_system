"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { RollingText } from "@/components/ui/rolling-text";

const FloatingNav = ({
  className,
  navItems,
}: {
  className?: string;
  navItems: {
    name: string;
    alternateText?: string;
    link?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  }[];
}) => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "flex fixed top-4 inset-x-0 max-w-fit mx-auto border border-gray-800 dark:border-white/[0.2] rounded-full dark:bg-black bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[999] pr-4 pl-4 py-2",
        className
      )}
    >
      {navItems.map((navItem, index) => (
        navItem.link ? (
          <Link
            key={`link=${index}`}
            href={navItem.link}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors",
              activeIndex === index 
                ? "text-black dark:text-black" 
                : "text-neutral-300 hover:text-neutral-300"
            )}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span className="relative z-20">
              <RollingText 
                text={navItem.name} 
                alternateText={navItem.alternateText}
                isHovered={activeIndex === index}
              />
            </span>
            {activeIndex === index && (
              <motion.div
                layoutId="pill"
                className="absolute inset-0 z-10 bg-white dark:bg-white rounded-full"
                transition={{ type: "spring", duration: 0.6 }}
              ></motion.div>
            )}
          </Link>
        ) : (
          <button
            key={`button=${index}`}
            onClick={navItem.onClick}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors",
              activeIndex === index 
                ? "text-black dark:text-black" 
                : "text-neutral-300 hover:text-neutral-300"
            )}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span className="relative z-20">
              <RollingText 
                text={navItem.name} 
                alternateText={navItem.alternateText}
                isHovered={activeIndex === index}
              />
            </span>
            {activeIndex === index && (
              <motion.div
                layoutId="pill"
                className="absolute inset-0 z-10 bg-white dark:bg-white rounded-full"
                transition={{ type: "spring", duration: 0.6 }}
              ></motion.div>
            )}
          </button>
        )
      ))}
    </motion.div>
  );
};

export default FloatingNav; 