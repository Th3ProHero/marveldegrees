"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { GraphNode } from "@/types";

interface NodeDetailProps {
  node: GraphNode | null;
  onClose: () => void;
}

export default function NodeDetail({ node, onClose }: NodeDetailProps) {
  if (!node) return null;

  const isActor = node.type === "actor" || node.type === "mcu";
  const borderColor = node.type === "mcu" ? "border-neon-purple/40" : node.type === "actor" ? "border-neon-cyan/40" : "border-white/10";
  const glowClass = node.type === "mcu" ? "glow-purple" : node.type === "actor" ? "glow-cyan" : "";
  const accentColor = node.type === "mcu" ? "text-neon-purple" : "text-neon-cyan";

  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className={`glass-panel-strong p-5 w-72 ${borderColor}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-gray hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="flex justify-center mb-4">
          <div className={`w-20 h-20 rounded-full overflow-hidden border-2 ${borderColor} ${glowClass}`}>
            {node.imageUrl ? (
              <img
                src={node.imageUrl}
                alt={node.label}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark-card text-2xl">
                {isActor ? "👤" : "🎬"}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className={`text-lg font-bold text-center mb-1 ${accentColor}`}>
          {node.label}
        </h3>

        {/* Type badge */}
        <div className="flex justify-center mb-3">
          <span className={`px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${
            node.type === "mcu"
              ? "border-neon-purple/30 text-neon-purple bg-neon-purple/10"
              : node.type === "actor"
              ? "border-neon-cyan/30 text-neon-cyan bg-neon-cyan/10"
              : "border-white/10 text-muted-gray bg-white/5"
          }`}>
            {node.type === "mcu" ? "MCU Actor" : node.type === "actor" ? "Actor" : "Movie"}
          </span>
        </div>

        {/* Character / MCU Role */}
        {node.mcuRole && (
          <div className="text-center mb-3">
            <span className="text-xs text-muted-gray">MCU Role: </span>
            <span className="text-sm font-semibold text-neon-purple">{node.mcuRole}</span>
          </div>
        )}

        {node.character && !node.mcuRole && (
          <div className="text-center mb-3">
            <span className="text-xs text-muted-gray">Character: </span>
            <span className="text-sm text-light-gray">{node.character}</span>
          </div>
        )}

        {/* TMDB Link */}
        <div className="pt-3 border-t border-white/5">
          <a
            href={`https://www.themoviedb.org/${isActor ? "person" : "movie"}/${node.tmdbId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-xs text-muted-gray hover:text-neon-cyan transition-colors"
          >
            <span>View on TMDB</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
