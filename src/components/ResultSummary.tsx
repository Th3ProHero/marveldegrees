"use client";

import { motion } from "framer-motion";
import AdBanner from "@/components/AdBanner";
import type { BFSResult, PathStep } from "@/types";

interface ResultSummaryProps {
  result: BFSResult;
}

export default function ResultSummary({ result }: ResultSummaryProps) {
  if (!result.found) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 relative overflow-hidden"
      >
        {/* ── Infinity Gauntlet Starburst Effect ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Central white flash */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.6] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute w-32 h-32 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)" }}
          />

          {/* Radiating light beams — one per Infinity Stone */}
          {[
            { color: "#F44336", angle: 0, delay: 0.3 },      // Reality (Red)
            { color: "#FF9800", angle: 60, delay: 0.45 },     // Soul (Orange)
            { color: "#FFEB3B", angle: 120, delay: 0.6 },     // Mind (Yellow)
            { color: "#4CAF50", angle: 180, delay: 0.75 },    // Time (Green)
            { color: "#2196F3", angle: 240, delay: 0.9 },     // Space (Blue)
            { color: "#9C27B0", angle: 300, delay: 1.05 },    // Power (Purple)
          ].map((beam, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1.2, 1], opacity: [0, 0.9, 0.5] }}
              transition={{ duration: 1, delay: beam.delay, ease: "easeOut" }}
              className="absolute"
              style={{
                width: "min(45vw, 380px)",
                height: "3px",
                background: `linear-gradient(90deg, ${beam.color} 0%, ${beam.color}80 30%, transparent 100%)`,
                transform: `rotate(${beam.angle}deg)`,
                transformOrigin: "left center",
                boxShadow: `0 0 12px ${beam.color}, 0 0 30px ${beam.color}80`,
                filter: "blur(0.5px)",
              }}
            />
          ))}
          {/* Mirrored beams (other direction) */}
          {[
            { color: "#F44336", angle: 15, delay: 0.35 },
            { color: "#FF9800", angle: 75, delay: 0.5 },
            { color: "#FFEB3B", angle: 135, delay: 0.65 },
            { color: "#4CAF50", angle: 195, delay: 0.8 },
            { color: "#2196F3", angle: 255, delay: 0.95 },
            { color: "#9C27B0", angle: 315, delay: 1.1 },
          ].map((beam, i) => (
            <motion.div
              key={`mirror-${i}`}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1.1, 0.8], opacity: [0, 0.7, 0.35] }}
              transition={{ duration: 1.2, delay: beam.delay, ease: "easeOut" }}
              className="absolute"
              style={{
                width: "min(35vw, 280px)",
                height: "2px",
                background: `linear-gradient(90deg, ${beam.color}CC 0%, transparent 100%)`,
                transform: `rotate(${beam.angle}deg)`,
                transformOrigin: "left center",
                boxShadow: `0 0 8px ${beam.color}80`,
                filter: "blur(1px)",
              }}
            />
          ))}

          {/* Pulsing ambient glow ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #F4433640, #FF980040, #FFEB3B40, #4CAF5040, #2196F340, #9C27B040, #F4433640)",
              filter: "blur(30px)",
            }}
          />

          {/* Small stone dots orbiting */}
          {[
            { color: "#F44336", size: 6, radius: 60, duration: 8, delay: 0 },
            { color: "#FF9800", size: 5, radius: 70, duration: 9, delay: 1.3 },
            { color: "#FFEB3B", size: 7, radius: 55, duration: 7, delay: 2.6 },
            { color: "#4CAF50", size: 5, radius: 75, duration: 10, delay: 3.9 },
            { color: "#2196F3", size: 6, radius: 65, duration: 8.5, delay: 5.2 },
            { color: "#9C27B0", size: 6, radius: 50, duration: 7.5, delay: 6.5 },
          ].map((dot, i) => (
            <motion.div
              key={`dot-${i}`}
              animate={{ rotate: 360 }}
              transition={{ duration: dot.duration, repeat: Infinity, ease: "linear", delay: dot.delay }}
              className="absolute"
              style={{ width: dot.radius * 2, height: dot.radius * 2 }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  width: dot.size,
                  height: dot.size,
                  background: dot.color,
                  boxShadow: `0 0 8px ${dot.color}, 0 0 20px ${dot.color}80`,
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Content card */}
        <div className="relative z-10 glass-panel border border-white/5 p-8 max-w-xl mx-auto shadow-2xl backdrop-blur-xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
            className="text-6xl mb-4"
          >
            💨
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl font-marvel tracking-wide text-marvel-red mb-3"
            style={{ textShadow: "0 0 20px rgba(226,54,54,0.5), 0 0 40px rgba(226,54,54,0.2)" }}
          >
            SNAPPED BY THANOS?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-muted-gray/70 max-w-md mx-auto"
          >
            We searched through <strong className="text-white">14,000,605</strong> alternate futures and couldn&apos;t find a connection to the MCU for <span className="text-neon-cyan font-medium">{result.sourceActor.name}</span> within 6 degrees. They must be stuck in a completely different universe!
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (result.degrees === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="degree-badge mx-auto mb-4 text-neon-purple">0</div>
        <h3 className="text-2xl font-bold text-gradient-marvel mb-2">
          Already in the MCU!
        </h3>
        <p className="text-sm text-muted-gray mb-3">
          <span className="text-neon-purple font-semibold">{result.sourceActor.name}</span> is part of the Marvel Cinematic Universe.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {result.targetActors.map((target, idx) => target.mcuRole && (
            <div key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-sm">
              <span>🎭</span>
              <span>{target.mcuRole}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Degree count */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="degree-badge mx-auto mb-3"
        >
          <span className="text-gradient-marvel">{result.degrees}</span>
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl font-bold"
        >
          <span className="text-gradient-marvel">
            {result.degrees} {result.degrees === 1 ? "Degree" : "Degrees"} of Marvel
          </span>
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-muted-gray mt-1 max-w-lg mx-auto"
        >
          {result.sourceActor.name} → {result.targetActors.map(t => t.name).join(", ")}
        </motion.p>
      </div>

      {/* Linear paths */}
      <div className="flex flex-col items-center gap-6 px-2 sm:px-4">
        {result.paths.map((path, pathIndex) => (
          <div key={`path-${pathIndex}`} className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 w-full max-w-full snap-x">
            {path.map((step, index) => (
              <motion.div
                key={`${step.type}-${step.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.15 }}
                className="flex items-center gap-2 flex-shrink-0"
              >
                {/* Step node */}
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    step.mcuRole
                      ? "border-neon-purple/40 bg-neon-purple/10 text-neon-purple"
                      : step.type === "actor"
                      ? "border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan"
                      : "border-white/10 bg-white/5 text-muted-gray"
                  }`}
                >
                  <span>{step.type === "actor" ? "👤" : "🎬"}</span>
                  <span className="max-w-[120px] truncate">{step.name}</span>
                </div>

                {/* Connector arrow */}
                {index < path.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8 + index * 0.15 + 0.1 }}
                  >
                    <svg className="w-4 h-4 text-muted-gray/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* AdBanner placed below the path result */}
      <div className="pt-4 px-4 w-full">
        <AdBanner dataAdSlot="1111111111" />
      </div>
    </motion.div>
  );
}
