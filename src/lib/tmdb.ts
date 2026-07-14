import type {
  TMDBSearchPersonResponse,
  TMDBPersonMovieCreditsResponse,
  TMDBMovieCreditsResponse,
} from "@/types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// Rate limiting: TMDB allows ~40 requests per 10 seconds
let requestQueue: Array<() => void> = [];
let requestCount = 0;
const MAX_REQUESTS_PER_WINDOW = 35;
const WINDOW_MS = 10_000;

function resetCounter() {
  requestCount = 0;
  // Process queued requests
  while (requestQueue.length > 0 && requestCount < MAX_REQUESTS_PER_WINDOW) {
    const resolve = requestQueue.shift();
    resolve?.();
    requestCount++;
  }
}

// Reset counter every window
let intervalId: ReturnType<typeof setInterval> | null = null;
function ensureInterval() {
  if (!intervalId) {
    intervalId = setInterval(resetCounter, WINDOW_MS);
  }
}

async function waitForSlot(): Promise<void> {
  ensureInterval();
  if (requestCount < MAX_REQUESTS_PER_WINDOW) {
    requestCount++;
    return;
  }
  return new Promise<void>((resolve) => {
    requestQueue.push(resolve);
  });
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  await waitForSlot();

  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is not configured");
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`TMDB API error ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

// ─── Public API ───

export async function searchPerson(query: string): Promise<TMDBSearchPersonResponse> {
  return tmdbFetch<TMDBSearchPersonResponse>("/search/person", {
    query,
    include_adult: "false",
    language: "en-US",
    page: "1",
  });
}

export async function getPersonMovieCredits(personId: number): Promise<TMDBPersonMovieCreditsResponse> {
  return tmdbFetch<TMDBPersonMovieCreditsResponse>(`/person/${personId}/movie_credits`, {
    language: "en-US",
  });
}

export async function getMovieCredits(movieId: number): Promise<TMDBMovieCreditsResponse> {
  return tmdbFetch<TMDBMovieCreditsResponse>(`/movie/${movieId}/credits`, {
    language: "en-US",
  });
}

export function getImageUrl(path: string | null, size: "w92" | "w185" | "w342" | "w500" | "original" = "w185"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
