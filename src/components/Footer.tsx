"use client";

import { motion } from "framer-motion";

const techStack = [
  { name: "Next.js 14", icon: "▲", color: "text-white" },
  { name: "React", icon: "⚛", color: "text-neon-cyan" },
  { name: "TypeScript", icon: "TS", color: "text-blue-400" },
  { name: "Prisma", icon: "◈", color: "text-white" },
  { name: "PostgreSQL", icon: "🐘", color: "text-blue-300" },
  { name: "Docker", icon: "🐳", color: "text-blue-400" },
  { name: "D3 / Force Graph", icon: "◉", color: "text-neon-purple" },
  { name: "Tailwind CSS", icon: "🎨", color: "text-neon-cyan" },
  { name: "Framer Motion", icon: "✦", color: "text-neon-pink" },
];

export default function Footer() {
  return (
    <footer id="info" className="relative py-20 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-gray/60 mb-6 block">
            Built With
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="glass-card px-4 py-2 flex items-center gap-2 hover:border-white/15 transition-all cursor-default"
              >
                <span className={`text-sm ${tech.color}`}>{tech.icon}</span>
                <span className="text-xs font-medium text-light-gray">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-12" />

        {/* Credits */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <div className="flex items-center gap-1 font-marvel text-2xl tracking-wide text-white">
              DEGREES OF <span className="bg-marvel-red text-white px-1 leading-none">MARVEL</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
          </motion.div>

          <p className="text-xs text-muted-gray/60 max-w-md mx-auto leading-relaxed">
            An interactive exploration of actor connections within the Marvel Cinematic Universe,
            powered by the TMDB API. Inspired by the Six Degrees of Kevin Bacon game.
          </p>

          {/* TMDB Attribution */}
          <div className="glass-card inline-flex items-center gap-3 px-4 py-2 mx-auto">
            <span className="text-xs text-muted-gray">Powered by</span>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-neon-cyan hover:text-white transition-colors"
            >
              TMDB API
            </a>
          </div>

          <p className="text-[10px] text-muted-gray/40 pt-4">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>

          <p className="text-[10px] text-muted-gray/30">
            © {new Date().getFullYear()} Degrees of Marvel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
