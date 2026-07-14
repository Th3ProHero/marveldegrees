"use client";

import { useRef, useCallback, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { getNodeSize, getNodeColor } from "@/lib/graph-utils";
import type { GraphData, GraphNode } from "@/types";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
    </div>
  ),
});

interface ForceGraphProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
}

// Image cache outside component to persist across renders
const imageCache: Record<string, HTMLImageElement> = {};

function preloadImage(url: string): Promise<HTMLImageElement> {
  if (imageCache[url]) return Promise.resolve(imageCache[url]);
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache[url] = img;
      resolve(img);
    };
    img.onerror = () => resolve(img); // Still resolve, just won't draw
    img.src = url;
  });
}

export default function ForceGraph({ data, onNodeClick }: ForceGraphProps) {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Preload images
  useEffect(() => {
    const urls = data.nodes
      .filter((n) => n.imageUrl)
      .map((n) => n.imageUrl!);
    
    if (urls.length === 0) {
      setImagesLoaded(true);
      return;
    }

    Promise.all(urls.map(preloadImage)).then(() => {
      setImagesLoaded(true);
    });
  }, [data.nodes]);

  // Responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (isFullscreen) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.max(400, Math.min(rect.width * 0.65, 600)),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isFullscreen]);

  // Re-center graph when toggling fullscreen
  useEffect(() => {
    if (graphRef.current && data.nodes.length > 0) {
      setTimeout(() => {
        graphRef.current?.zoomToFit(600, 60);
      }, 300);
    }
  }, [isFullscreen]);

  // Escape key to exit fullscreen
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen]);

  // Center the graph when data changes
  useEffect(() => {
    if (graphRef.current && data.nodes.length > 0) {
      setTimeout(() => {
        graphRef.current?.zoomToFit(600, 60);
      }, 800);
    }
  }, [data]);

  // Custom node rendering
  const paintNode = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const graphNode = node as GraphNode;
      const size = getNodeSize(graphNode.type);
      const color = getNodeColor(graphNode.type);
      const x = node.x ?? 0;
      const y = node.y ?? 0;

      // Glow effect
      const glowRadius = size * 2.5;
      const gradient = ctx.createRadialGradient(x, y, size * 0.5, x, y, glowRadius);
      gradient.addColorStop(0, color + "40");
      gradient.addColorStop(1, color + "00");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);

      // Try to draw image
      const imgUrl = graphNode.imageUrl;
      if (imgUrl && imageCache[imgUrl] && imageCache[imgUrl].complete && imageCache[imgUrl].naturalWidth > 0) {
        ctx.save();
        ctx.clip();
        try {
          ctx.drawImage(
            imageCache[imgUrl],
            x - size,
            y - size,
            size * 2,
            size * 2
          );
        } catch {
          ctx.fillStyle = color + "30";
          ctx.fill();
        }
        ctx.restore();

        // Border
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = graphNode.type === "mcu" ? 2.5 : 1.5;
        ctx.stroke();
      } else {
        // Solid color circle
        ctx.fillStyle = color + "30";
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = graphNode.type === "mcu" ? 2.5 : 1.5;
        ctx.stroke();

        // Icon for movies
        if (graphNode.type === "movie") {
          ctx.fillStyle = "#666";
          ctx.font = `${size * 0.8}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🎬", x, y);
        }
      }

      // Label
      const fontSize = Math.max(10 / globalScale, 3);
      ctx.font = `${graphNode.type === "mcu" ? "bold " : ""}${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // Text shadow
      ctx.fillStyle = "rgba(0,0,0,0.8)";
      ctx.fillText(graphNode.label, x + 0.5, y + size + 3.5);
      
      // Text
      ctx.fillStyle = graphNode.type === "mcu" ? "#b026ff" : graphNode.type === "actor" ? "#00f0ff" : "#888";
      ctx.fillText(graphNode.label, x, y + size + 3);

      // MCU role subtitle
      if (graphNode.mcuRole) {
        const subFontSize = Math.max(8 / globalScale, 2.5);
        ctx.font = `${subFontSize}px Inter, sans-serif`;
        ctx.fillStyle = "#b026ff";
        ctx.fillText(`★ ${graphNode.mcuRole}`, x, y + size + 3 + fontSize + 2);
      }
    },
    [imagesLoaded]
  );

  // Link rendering
  const paintLink = useCallback(
    (link: any, ctx: CanvasRenderingContext2D) => {
      const source = link.source;
      const target = link.target;
      if (!source || !target) return;

      const sx = source.x ?? 0;
      const sy = source.y ?? 0;
      const tx = target.x ?? 0;
      const ty = target.y ?? 0;

      // Gradient link
      const gradient = ctx.createLinearGradient(sx, sy, tx, ty);
      gradient.addColorStop(0, "rgba(0, 240, 255, 0.3)");
      gradient.addColorStop(1, "rgba(176, 38, 255, 0.3)");

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Animated dots along the link
      const t = (Date.now() % 3000) / 3000;
      const dotX = sx + (tx - sx) * t;
      const dotY = sy + (ty - sy) * t;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0, 240, 255, 0.6)";
      ctx.fill();
    },
    []
  );

  const graphData = useMemo(() => ({
    nodes: data.nodes.map(n => ({ ...n })),
    links: data.links.map(l => ({ ...l })),
  }), [data]);

  if (data.nodes.length === 0) return null;

  const graphContent = (
    <>
      {/* Fullscreen toggle button */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-surface/80 backdrop-blur-sm border border-white/10 text-xs text-muted-gray hover:text-white hover:border-neon-cyan/40 transition-all duration-300 group"
        title={isFullscreen ? "Exit fullscreen (Esc)" : "Expand graph"}
      >
        {isFullscreen ? (
          <>
            <svg className="w-3.5 h-3.5 group-hover:text-neon-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Exit</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5 group-hover:text-neon-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>Expand</span>
          </>
        )}
      </button>

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData as any}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        nodeCanvasObject={paintNode}
        linkCanvasObject={paintLink}
        nodeRelSize={6}
        linkDirectionalParticles={0}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTicks={100}
        onNodeClick={(node: any) => onNodeClick?.(node as GraphNode)}
        onNodeDragEnd={(node: any) => {
          node.fx = node.x;
          node.fy = node.y;
        }}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        enableNodeDrag={true}
      />
    </>
  );

  if (isFullscreen) {
    return (
      <>
        {/* Keep the ref container in the DOM for when we exit fullscreen */}
        <div ref={containerRef} className="w-full h-[1px]" />
        {/* Fullscreen overlay */}
        <div className="fixed inset-0 z-50 bg-dark-charcoal flex items-center justify-center">
          <div className="relative w-full h-full">
            {graphContent}
          </div>
        </div>
      </>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full rounded-2xl overflow-hidden border border-white/5 bg-dark-charcoal/50">
      {graphContent}
    </div>
  );
}
