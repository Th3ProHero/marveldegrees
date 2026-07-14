"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phrases = [
  "Traversing the cinematic universe...",
  "Consulting the Book of Cagliostro...",
  "Searching 14,000,605 alternate futures...",
  "Accessing the TVA temporal loom...",
  "Opening portals across the Multiverse...",
  "Asking Wong for forbidden knowledge...",
  "Hacking into S.H.I.E.L.D. databases...",
  "Scanning the quantum realm..."
];

export default function LoadingPhrases() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Change phrase every 8 seconds
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-6 relative overflow-hidden flex items-center justify-center w-full">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-neon-cyan font-medium absolute text-center"
        >
          {phrases[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
