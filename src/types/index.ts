// ─── TMDB API Types ───

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
  known_for_department: string;
  known_for: TMDBKnownFor[];
}

export interface TMDBKnownFor {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  release_date?: string;
}

export interface TMDBSearchPersonResponse {
  page: number;
  results: TMDBPerson[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  character: string;
  credit_id: string;
  order?: number;
}

export interface TMDBPersonMovieCreditsResponse {
  id: number;
  cast: TMDBMovieCredit[];
}

export interface TMDBCastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
  order: number;
  popularity: number;
  known_for_department: string;
}

export interface TMDBMovieCreditsResponse {
  id: number;
  cast: TMDBCastMember[];
}

// ─── Graph Types ───

export type NodeType = "actor" | "movie" | "mcu";

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  tmdbId: number;
  imageUrl: string | null;
  character?: string;
  mcuRole?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// ─── BFS Types ───

export interface PathStep {
  type: "actor" | "movie";
  id: number;
  name: string;
  imagePath: string | null;
  character?: string;
  mcuRole?: string;
}

export interface BFSResult {
  found: boolean;
  degrees: number;
  paths: PathStep[][];
  graphData: GraphData;
  sourceActor: PathStep;
  targetActors: PathStep[];
}

// ─── API Types ───

export interface SearchResult {
  id: number;
  name: string;
  profilePath: string | null;
  popularity: number;
  knownFor: string;
}

export interface CalculateDegreesRequest {
  actorId: number;
  actorName: string;
}

export interface CalculateDegreesResponse {
  success: boolean;
  cached: boolean;
  data?: BFSResult;
  error?: string;
}
