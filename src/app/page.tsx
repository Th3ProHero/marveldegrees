"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import SearchInput from "@/components/SearchInput";
import ForceGraph from "@/components/ForceGraph";
import NodeDetail from "@/components/NodeDetail";
import ResultSummary from "@/components/ResultSummary";
import LoadingPhrases from "@/components/LoadingPhrases";
import AboutSection from "@/components/AboutSection";
import WorkMethod from "@/components/WorkMethod";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import type { SearchResult, BFSResult, GraphNode, CalculateDegreesResponse } from "@/types";

export default function Home() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<BFSResult | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wasCached, setWasCached] = useState(false);

  const handleSelectActor = useCallback(async (actor: SearchResult) => {
    setIsCalculating(true);
    setError(null);
    setResult(null);
    setSelectedNode(null);
    setWasCached(false);

    try {
      const response = await fetch("/api/calculate-degrees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorId: actor.id, actorName: actor.name }),
      });

      const data: CalculateDegreesResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
        setWasCached(data.cached);
      } else {
        setError(data.error || "Failed to calculate degrees");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  return (
    <>
      <Navbar />

      {/* ─── Hero / Search Section ─── */}
      <section id="search" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16">
        {/* Floating particles */}
        <div className="particle-dot" style={{ top: "15%", left: "10%", animationDelay: "0s" }} />
        <div className="particle-dot" style={{ top: "25%", right: "15%", animationDelay: "2s" }} />
        <div className="particle-dot" style={{ bottom: "30%", left: "20%", animationDelay: "4s" }} />
        <div className="particle-dot" style={{ bottom: "20%", right: "10%", animationDelay: "1s" }} />

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/3 mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-muted-gray font-medium">Powered by TMDB + BFS Algorithm</span>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl font-marvel leading-none mb-6 flex flex-col items-center justify-center tracking-wide"
          >
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white drop-shadow-md text-3xl sm:text-4xl md:text-5xl mb-1"
            >
              DEGREES OF
            </motion.span>
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
              className="bg-marvel-red text-white px-3 sm:px-4 py-1 inline-block hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(226,54,54,0.5)]"
            >
              MARVEL
            </motion.span>
          </motion.h1>
          <p className="text-muted-gray text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            How far is any actor from the Marvel Cinematic Universe?
            <br className="hidden sm:block" />
            Search an actor and discover their path to the MCU.
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-2xl mb-8"
        >
          <SearchInput onSelectActor={handleSelectActor} isLoading={isCalculating} />
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isCalculating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="w-16 h-16 border-2 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
                <div className="absolute w-10 h-10 border-2 border-neon-purple/20 border-b-neon-purple rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              </div>
              <div className="mt-4">
                <LoadingPhrases />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-panel border-red-500/20 p-6 max-w-md text-center"
            >
              <div className="text-3xl mb-3">⚠️</div>
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && !isCalculating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-5xl"
            >
              {/* Cache badge */}
              {wasCached && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center mb-4"
                >
                  <span className="px-3 py-1 rounded-full text-[10px] font-medium border border-green-500/20 text-green-400 bg-green-500/5">
                    ⚡ Cached result — instant response
                  </span>
                </motion.div>
              )}

              {/* Result Summary */}
              <ResultSummary result={result} />

              {/* Graph + Detail Panel */}
              {result.found && result.graphData.nodes.length > 1 && (
                <div className="mt-8 flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <ForceGraph data={result.graphData} onNodeClick={handleNodeClick} />
                  </div>
                  
                  {/* Node detail panel */}
                  <AnimatePresence>
                    {selectedNode && (
                      <div className="hidden lg:block">
                        <NodeDetail node={selectedNode} onClose={() => setSelectedNode(null)} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile node detail (overlay) */}
              <AnimatePresence>
                {selectedNode && (
                  <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4">
                    <NodeDetail node={selectedNode} onClose={() => setSelectedNode(null)} />
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        {!result && !isCalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] text-muted-gray/40 tracking-widest uppercase">Scroll</span>
              <svg className="w-4 h-4 text-muted-gray/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* ─── Other Sections ─── */}
      <AboutSection />
      
      <div className="px-4">
        <AdBanner dataAdSlot="1234567890" />
      </div>

      <WorkMethod />
      
      <div className="px-4">
        <AdBanner dataAdSlot="0987654321" />
      </div>

      <Footer />
    </>
  );
}
