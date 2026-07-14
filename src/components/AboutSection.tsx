"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neon-cyan/60 mb-3 block">
            The Theory
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-marvel">Six Degrees</span> of Separation
          </h2>
          <p className="text-muted-gray max-w-xl mx-auto text-sm leading-relaxed">
            The idea that any two people on Earth are connected through at most six acquaintances.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="glass-panel p-8 group hover:border-neon-cyan/20 transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mb-5 group-hover:glow-cyan transition-all">
              <span className="text-2xl">🎭</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">The Kevin Bacon Game</h3>
            <p className="text-sm text-muted-gray leading-relaxed">
              Originally based on the actor Kevin Bacon, the parlor game challenges players to
              connect any actor to Bacon through shared movie appearances. Each shared movie
              counts as one &quot;degree&quot; of separation.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-panel p-8 group hover:border-neon-purple/20 transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mb-5 group-hover:glow-purple transition-all">
              <span className="text-2xl">🦸</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">The Marvel Twist</h3>
            <p className="text-sm text-muted-gray leading-relaxed">
              We replace Kevin Bacon with the entire MCU ensemble. Instead of connecting to one
              actor, we find the shortest path from any actor to <em>any</em> of the 30+ core
              MCU cast members — Iron Man, Captain America, Thor, and beyond.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-panel p-8 group hover:border-neon-pink/20 transition-all duration-500"
          >
            <div className="w-12 h-12 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mb-5 transition-all">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Graph Theory</h3>
            <p className="text-sm text-muted-gray leading-relaxed">
              Mathematically, this is a shortest-path problem in a bipartite graph. Actors
              and movies form nodes, and &quot;appeared in&quot; forms edges. We use Breadth-First
              Search (BFS) to find the minimum number of hops.
            </p>
          </motion.div>
        </div>

        {/* Visual diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 glass-panel p-8 md:p-12"
        >
          <h3 className="text-center text-lg font-bold mb-8 text-muted-gray">
            How It Works
          </h3>
          <div className="flex items-center justify-start md:justify-center gap-2 md:gap-4 overflow-x-auto pb-4 w-full snap-x">
            {/* Source actor */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0 snap-center">
              <div className="w-14 h-14 rounded-full border-2 border-neon-cyan/40 bg-neon-cyan/10 flex items-center justify-center text-xl">
                👤
              </div>
              <span className="text-xs text-neon-cyan font-medium">Any Actor</span>
            </div>

            <div className="connection-line flex-shrink-0" />

            {/* Movie 1 */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0 snap-center">
              <div className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-lg">
                🎬
              </div>
              <span className="text-xs text-muted-gray">Movie</span>
            </div>

            <div className="connection-line flex-shrink-0" />

            {/* Intermediate actor */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0 snap-center">
              <div className="w-12 h-12 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 flex items-center justify-center text-lg">
                👤
              </div>
              <span className="text-xs text-muted-gray">Actor</span>
            </div>

            <div className="connection-line flex-shrink-0" />

            {/* Movie 2 */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0 snap-center">
              <div className="w-12 h-12 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-lg">
                🎬
              </div>
              <span className="text-xs text-muted-gray">Movie</span>
            </div>

            <div className="connection-line flex-shrink-0" />

            {/* MCU Actor */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0 snap-center">
              <div className="w-14 h-14 rounded-full border-2 border-neon-purple/40 bg-neon-purple/10 flex items-center justify-center text-xl animate-pulse-glow-purple">
                🦸
              </div>
              <span className="text-xs text-neon-purple font-medium">MCU Actor</span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-gray/60 mt-6">
            This example shows a 2-degree connection: Actor → Movie → Actor → Movie → MCU Actor
          </p>
        </motion.div>
      </div>
    </section>
  );
}
