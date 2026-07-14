import type { BFSResult, GraphData, GraphNode, GraphLink } from "@/types";
import { getImageUrl } from "@/lib/tmdb";

/**
 * Transform a BFS result's path into force-graph compatible data with 
 * proper positioning and styling attributes.
 */
export function transformPathToGraphData(result: BFSResult): GraphData {
  if (!result.found || result.paths.length === 0) {
    return { nodes: [], links: [] };
  }

  return result.graphData;
}

/**
 * Calculate node size based on type
 */
export function getNodeSize(type: string): number {
  switch (type) {
    case "mcu":
      return 14;
    case "actor":
      return 12;
    case "movie":
      return 10;
    default:
      return 8;
  }
}

/**
 * Get node color based on type
 */
export function getNodeColor(type: string): string {
  switch (type) {
    case "mcu":
      return "#b026ff"; // neon purple
    case "actor":
      return "#00f0ff"; // neon cyan
    case "movie":
      return "#444444"; // dark gray
    default:
      return "#666666";
  }
}

/**
 * Get link color (gradient between node types)
 */
export function getLinkColor(): string {
  return "rgba(255, 255, 255, 0.15)";
}
