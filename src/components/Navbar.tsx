"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "search", label: "Search", icon: "◎" },
  { id: "about", label: "About", icon: "◈" },
  { id: "method", label: "Method", icon: "◆" },
  { id: "info", label: "Info", icon: "◇" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("search");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section based on scroll position
      const sections = navItems.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return { id: item.id, top: 0 };
        return { id: item.id, top: el.getBoundingClientRect().top };
      });

      const active = sections.reduce((closest, section) => {
        if (section.top <= 150 && section.top > closest.top) return section;
        return closest;
      }, sections[0]);

      if (active) setActiveSection(active.id);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isScrolled ? "top-2" : "top-4"
      }`}
    >
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-1 glass-panel px-2 py-2">
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 mr-2">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-glow-cyan" />
          <span className="text-sm font-bold tracking-wider text-gradient-marvel">
            DEGREES
          </span>
        </div>

        {/* Nav Items */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeSection === item.id
                ? "text-neon-cyan"
                : "text-muted-gray hover:text-white"
            }`}
          >
            {activeSection === item.id && (
              <motion.div
                layoutId="activeNavBg"
                className="absolute inset-0 rounded-xl bg-white/5 border border-neon-cyan/20"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-xs opacity-60">{item.icon}</span>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="glass-panel px-4 py-3 flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-glow-cyan" />
          <span className="text-sm font-bold tracking-wider text-gradient-marvel">
            DEGREES
          </span>
          <div className="flex flex-col gap-1 ml-2">
            <span className={`block w-4 h-[1.5px] bg-white transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
            <span className={`block w-4 h-[1.5px] bg-white transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-[2px]" : ""}`} />
          </div>
        </button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 glass-panel-strong p-2"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? "text-neon-cyan bg-white/5"
                      : "text-muted-gray hover:text-white hover:bg-white/3"
                  }`}
                >
                  <span className="mr-3 opacity-60">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
