"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Actor Search",
    description:
      "You type an actor's name and we query the TMDB API (/search/person) in real-time. Results appear with autocomplete as you type.",
    icon: "🔍",
    color: "cyan" as const,
    detail: "TMDB API → /search/person?query={name}",
  },
  {
    number: "02",
    title: "Cache Check",
    description:
      "Before running the algorithm, we check PostgreSQL for a cached result. If this actor was searched before, we return the result instantly.",
    icon: "💾",
    color: "cyan" as const,
    detail: "SELECT * FROM cached_paths WHERE source_actor_id = ?",
  },
  {
    number: "03",
    title: "BFS Initialization",
    description:
      "We load the 30+ MCU seed actors as our target set. The search actor becomes the root of our BFS tree. We initialize the visited set.",
    icon: "🌳",
    color: "purple" as const,
    detail: "Queue = [sourceActor], Visited = {sourceActor}, Targets = MCU_SET",
  },
  {
    number: "04",
    title: "Expand Movie Credits",
    description:
      "For each actor in the current BFS level, we fetch their movie credits from TMDB. We examine the top 15 movies sorted by cast billing order.",
    icon: "🎬",
    color: "purple" as const,
    detail: "TMDB API → /person/{id}/movie_credits",
  },
  {
    number: "05",
    title: "Check Co-Stars",
    description:
      "For each movie, we get the full cast list. We check each co-star: are they in the MCU set? If YES → path found! If NO → add to next BFS level.",
    icon: "🎯",
    color: "purple" as const,
    detail: "TMDB API → /movie/{id}/credits → Check cast ∩ MCU_SET",
  },
  {
    number: "06",
    title: "Result & Cache",
    description:
      "Once a connection is found, we build the full path, generate graph data for visualization, cache the result in PostgreSQL, and return it.",
    icon: "✨",
    color: "cyan" as const,
    detail: "INSERT INTO cached_paths (path_data) → Return GraphData",
  },
];

export default function WorkMethod() {
  return (
    <section id="method" className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neon-purple/60 mb-3 block">
            Under the Hood
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-marvel">How the BFS</span> Algorithm Works
          </h2>
          <p className="text-muted-gray max-w-xl mx-auto text-sm leading-relaxed">
            A step-by-step breakdown of the Breadth-First Search algorithm that powers
            every connection discovery.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[28px] md:left-[32px] top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan/30 via-neon-purple/30 to-transparent" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative flex gap-6 group"
              >
                {/* Step indicator */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl border transition-all duration-500 ${
                      step.color === "cyan"
                        ? "border-neon-cyan/30 bg-neon-cyan/5 group-hover:border-neon-cyan/60 group-hover:bg-neon-cyan/10"
                        : "border-neon-purple/30 bg-neon-purple/5 group-hover:border-neon-purple/60 group-hover:bg-neon-purple/10"
                    }`}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="glass-card p-5 flex-1 group-hover:border-white/15 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-mono font-bold ${
                        step.color === "cyan" ? "text-neon-cyan" : "text-neon-purple"
                      }`}
                    >
                      {step.number}
                    </span>
                    <h3 className="text-base font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-gray leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <div className="px-3 py-1.5 rounded-lg bg-dark-charcoal border border-white/5 inline-block">
                    <code className="text-[11px] font-mono text-neon-cyan/70">
                      {step.detail}
                    </code>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Complexity note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 glass-panel p-6 text-center"
        >
          <p className="text-sm text-muted-gray">
            <span className="text-neon-cyan font-semibold">Time Complexity:</span>{" "}
            O(b<sup>d</sup>) where b = branching factor (co-stars per movie × movies per actor) and d = depth.
            <br />
            <span className="text-neon-purple font-semibold">Space Complexity:</span>{" "}
            O(b<sup>d</sup>) for the visited set. Cached results return in O(1).
          </p>
        </motion.div>
      </div>
    </section>
  );
}
