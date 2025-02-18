"use client";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";

export const RollingText = ({ 
  text, 
  isHovered,
  alternateText
}: { 
  text: string; 
  isHovered: boolean;
  alternateText?: string;
}) => {
  const controls = useAnimationControls();
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (isHovered) {
      controls.start({
        y: ["0%", "-100%"],
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }).then(() => {
        setDisplayText(alternateText || text);
        controls.set({ y: "100%" });
        controls.start({
          y: "0%",
          transition: {
            duration: 0.3,
            ease: "easeInOut",
          },
        });
      });
    } else {
      controls.start({
        y: ["0%", "-100%"],
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }).then(() => {
        setDisplayText(text);
        controls.set({ y: "100%" });
        controls.start({
          y: "0%",
          transition: {
            duration: 0.3,
            ease: "easeInOut",
          },
        });
      });
    }
  }, [isHovered, controls, text, alternateText]);

  return (
    <div className="overflow-hidden h-[1.2em]">
      <motion.span
        className="inline-block"
        animate={controls}
      >
        {displayText}
      </motion.span>
    </div>
  );
}; 