"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
import type { SearchResult } from "@/types";

interface SearchInputProps {
  onSelectActor: (actor: SearchResult) => void;
  isLoading: boolean;
}

export default function SearchInput({ onSelectActor, isLoading }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  const searchActors = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(data.results?.length > 0);
        setHighlightedIndex(-1);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchActors(value);
  };

  const handleSelect = (actor: SearchResult) => {
    setQuery(actor.name);
    setIsOpen(false);
    setResults([]);
    onSelectActor(actor);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/30 to-neon-purple/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        
        <div className="relative glass-panel-strong flex items-center px-5 py-4">
          {/* Search icon */}
          <svg
            className={`w-5 h-5 mr-3 transition-colors ${
              isSearching ? "text-neon-cyan animate-pulse" : "text-muted-gray"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Search any actor... (e.g. Tom Hanks)"
            disabled={isLoading}
            className="flex-1 bg-transparent text-white text-base sm:text-lg placeholder-muted-gray/60 focus:outline-none disabled:opacity-50"
            id="actor-search-input"
          />

          {/* Loading / Clear button */}
          {isLoading ? (
            <div className="ml-3">
              <div className="w-5 h-5 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
            </div>
          ) : (
            query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="ml-3 text-muted-gray hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )
          )}
        </div>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 glass-panel-strong overflow-hidden z-50 origin-top"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {results.map((actor, index) => (
              <button
                key={actor.id}
                onClick={() => handleSelect(actor)}
                className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-all duration-200 ${
                  index === highlightedIndex
                    ? "bg-neon-cyan/10 text-neon-cyan"
                    : "hover:bg-white/5 text-white"
                } ${index !== results.length - 1 ? "border-b border-white/5" : ""}`}
              >
                {/* Actor photo */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-card flex-shrink-0 border border-white/10">
                  {actor.profilePath ? (
                    <img
                      src={actor.profilePath}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-gray text-xs">
                      ?
                    </div>
                  )}
                </div>

                {/* Actor info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{actor.name}</div>
                  {actor.knownFor && (
                    <div className="text-xs text-muted-gray truncate mt-0.5">
                      {actor.knownFor}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <svg className="w-4 h-4 text-muted-gray/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
