import { NextRequest, NextResponse } from "next/server";
import { searchPerson, getImageUrl } from "@/lib/tmdb";
import type { SearchResult } from "@/types";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await searchPerson(query.trim());

    const results: SearchResult[] = data.results
      .filter((person) => person.known_for_department === "Acting")
      .slice(0, 10)
      .map((person) => ({
        id: person.id,
        name: person.name,
        profilePath: getImageUrl(person.profile_path, "w185"),
        popularity: person.popularity,
        knownFor: person.known_for
          .map((kf) => kf.title || kf.name)
          .filter(Boolean)
          .slice(0, 3)
          .join(", "),
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search actors", results: [] },
      { status: 500 }
    );
  }
}
