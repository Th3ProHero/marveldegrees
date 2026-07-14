import { prisma } from "@/lib/prisma";
import { getPersonMovieCredits, getMovieCredits, getImageUrl } from "@/lib/tmdb";
import { MCU_MOVIE_IDS } from "@/lib/mcu-movies";
import type { BFSResult, PathStep, GraphNode, GraphLink } from "@/types";

const MAX_BFS_DEPTH = 4;
const MAX_EXECUTION_TIME_MS = 45000; // 45 seconds limit
// Only consider actors in the top N of the cast list to keep BFS focused
const MAX_CAST_PER_MOVIE = 20;
// Only consider the top N movies per actor (sorted by popularity/relevance)
const MAX_MOVIES_PER_ACTOR = 15;

interface BFSQueueItem {
  actorId: number;
  actorName: string;
  actorImage: string | null;
  depth: number;
  pathSoFar: PathStep[];
}

/**
 * BFS algorithm to find the shortest connection path from a source actor to any MCU actor.
 * 
 * The algorithm works level by level:
 * 1. Start with the source actor
 * 2. Get their movie credits from TMDB
 * 3. For each movie, get the full cast
 * 4. Check if any cast member is an MCU actor
 * 5. If found → build the path. If not → add new actors to the next BFS level
 * 6. Repeat until found or MAX_DEPTH reached
 */
export async function findDegreesOfMarvel(
  sourceActorId: number,
  sourceActorName: string
): Promise<BFSResult> {
  // Load MCU seed actor IDs
  const mcuSeeds = await prisma.mcuSeedActor.findMany();
  const mcuIdSet = new Set(mcuSeeds.map((s) => s.tmdbId));
  const mcuMap = new Map(mcuSeeds.map((s) => [s.tmdbId, s]));

  // Check if source actor IS an MCU actor
  if (mcuIdSet.has(sourceActorId)) {
    const mcuActor = mcuMap.get(sourceActorId)!;
    const step: PathStep = {
      type: "actor",
      id: sourceActorId,
      name: sourceActorName,
      imagePath: null,
      mcuRole: mcuActor.character,
    };
    return {
      found: true,
      degrees: 0,
      paths: [[step]],
      graphData: {
        nodes: [
          {
            id: `actor-${sourceActorId}`,
            label: sourceActorName,
            type: "mcu",
            tmdbId: sourceActorId,
            imageUrl: null,
            mcuRole: mcuActor.character,
          },
        ],
        links: [],
      },
      sourceActor: step,
      targetActors: [step],
    };
  }

  // BFS
  const startTime = Date.now();
  const visited = new Set<number>();
  visited.add(sourceActorId);

  let queue: BFSQueueItem[] = [
    {
      actorId: sourceActorId,
      actorName: sourceActorName,
      actorImage: null,
      depth: 0,
      pathSoFar: [
        {
          type: "actor",
          id: sourceActorId,
          name: sourceActorName,
          imagePath: null,
        },
      ],
    },
  ];

  let foundPaths: PathStep[][] = [];
  let minDegrees = Infinity;
  let targetActors: PathStep[] = [];
  const MAX_CONNECTIONS = 3;

  let timedOut = false;

  while (queue.length > 0 && !timedOut) {
    const nextQueue: BFSQueueItem[] = [];

    for (const item of queue) {
      if (Date.now() - startTime > MAX_EXECUTION_TIME_MS) {
        console.warn(`BFS timeout reached for ${sourceActorName}`);
        timedOut = true;
        break;
      }

      if (item.depth >= MAX_BFS_DEPTH) continue;
      if (foundPaths.length >= MAX_CONNECTIONS) break;

      try {
        // Get this actor's movie credits
        const credits = await getPersonMovieCredits(item.actorId);
        
        // CHECK: Is this actor directly in an MCU movie?
        // This catches actors like Matt Damon or Sam Neill who are not in the core seed list
        const mcuMovie = credits.cast.find(m => MCU_MOVIE_IDS.has(m.id));
        if (mcuMovie) {
          const finalPath = [...item.pathSoFar];
          const lastStep = finalPath[finalPath.length - 1];
          const role = mcuMovie.character || "Cameo/Minor Role";
          lastStep.mcuRole = `${role} (in ${mcuMovie.title})`;

          const degrees = item.depth;
          if (degrees < minDegrees) {
            minDegrees = degrees;
            foundPaths = [finalPath];
            targetActors = [lastStep];
          } else if (degrees === minDegrees) {
            if (!targetActors.find(t => t.id === lastStep.id)) {
              foundPaths.push(finalPath);
              targetActors.push(lastStep);
            }
          }

          if (foundPaths.length >= MAX_CONNECTIONS) break;
          continue; // Found connection for this actor, move to next in queue
        }

        // If we already found a connection at this depth, no need to look deeper
        if (minDegrees === item.depth) {
          continue;
        }

        // Filter and sort movies: only real movies, sorted by vote_count (blockbusters first)
        // Blockbusters have massive casts and provide the best bridges to the MCU
        const movies = credits.cast
          .filter((m) => m.release_date && m.title)
          .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
          .slice(0, MAX_MOVIES_PER_ACTOR);

        for (const movie of movies) {
          if (foundPaths.length >= MAX_CONNECTIONS) break;
          try {
            // Get cast of this movie
            const movieCredits = await getMovieCredits(movie.id);
            const cast = movieCredits.cast
              .filter((c) => c.known_for_department === "Acting")
              .slice(0, MAX_CAST_PER_MOVIE);

            for (const castMember of cast) {
              if (foundPaths.length >= MAX_CONNECTIONS) break;
              if (visited.has(castMember.id)) continue;

              const movieStep: PathStep = {
                type: "movie",
                id: movie.id,
                name: movie.title,
                imagePath: movie.poster_path,
                character: movie.character,
              };

              const actorStep: PathStep = {
                type: "actor",
                id: castMember.id,
                name: castMember.name,
                imagePath: castMember.profile_path,
                character: castMember.character,
              };

              // Check if this cast member is an MCU actor
              if (mcuIdSet.has(castMember.id)) {
                // Verify this actor genuinely has MCU credits (prevents ID collision bugs)
                const verifyCredits = await getPersonMovieCredits(castMember.id);
                const mcuCredit = verifyCredits.cast.find(m => MCU_MOVIE_IDS.has(m.id));

                if (mcuCredit) {
                  // Confirmed MCU actor — use their actual MCU role from real credits
                  actorStep.mcuRole = `${mcuCredit.character || "Unknown Role"} (in ${mcuCredit.title})`;

                  const finalPath = [...item.pathSoFar, movieStep, actorStep];
                  const degrees = item.depth + 1;

                  if (degrees < minDegrees) {
                    minDegrees = degrees;
                    foundPaths = [finalPath];
                    targetActors = [actorStep];
                  } else if (degrees === minDegrees) {
                    if (!targetActors.find(t => t.id === actorStep.id)) {
                      foundPaths.push(finalPath);
                      targetActors.push(actorStep);
                    }
                  }
                } else {
                  // ID collision — this person isn't actually in MCU movies. Treat as regular actor.
                  console.warn(`⚠️ ID collision: ${castMember.name} (${castMember.id}) matched seed but has no MCU credits`);
                  if (minDegrees === Infinity) {
                    visited.add(castMember.id);
                    nextQueue.push({
                      actorId: castMember.id,
                      actorName: castMember.name,
                      actorImage: castMember.profile_path,
                      depth: item.depth + 1,
                      pathSoFar: [...item.pathSoFar, movieStep, actorStep],
                    });
                  }
                }
              } else {
                // Not MCU, add to next BFS level ONLY if we haven't found any connections yet
                if (minDegrees === Infinity) {
                  visited.add(castMember.id);
                  nextQueue.push({
                    actorId: castMember.id,
                    actorName: castMember.name,
                    actorImage: castMember.profile_path,
                    depth: item.depth + 1,
                    pathSoFar: [...item.pathSoFar, movieStep, actorStep],
                  });
                }
              }
            }
          } catch (err) {
            // Skip movies that fail to load credits
            console.warn(`Failed to get credits for movie ${movie.id}:`, err);
            continue;
          }
        }
      } catch (err) {
        console.warn(`Failed to get credits for actor ${item.actorId}:`, err);
        continue;
      }
    }

    if (foundPaths.length > 0) {
      break; // Found connections at this depth, stop BFS
    }

    queue = nextQueue;
  }

  if (foundPaths.length > 0) {
    const result: BFSResult = {
      found: true,
      degrees: minDegrees,
      paths: foundPaths,
      graphData: buildGraphData(foundPaths),
      sourceActor: foundPaths[0][0],
      targetActors: targetActors,
    };

    await cacheResult(sourceActorId, sourceActorName, result);
    
    // Cache all entities from all paths
    for (const p of foundPaths) {
      await cachePathEntities(p);
    }

    return result;
  }

  // No connection found
  return {
    found: false,
    degrees: -1,
    paths: [],
    graphData: { nodes: [], links: [] },
    sourceActor: { type: "actor", id: sourceActorId, name: sourceActorName, imagePath: null },
    targetActors: [],
  };
}

function buildGraphData(paths: PathStep[][]): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeIds = new Set<string>();
  const linkIds = new Set<string>();

  for (const path of paths) {
    for (let i = 0; i < path.length; i++) {
      const step = path[i];
      const nodeId = `${step.type}-${step.id}`;

      if (!nodeIds.has(nodeId)) {
        nodeIds.add(nodeId);

        const isLastActor = i === path.length - 1 && step.type === "actor";
        const nodeType = step.mcuRole ? "mcu" : step.type === "actor" ? "actor" : "movie";

        nodes.push({
          id: nodeId,
          label: step.name,
          type: nodeType,
          tmdbId: step.id,
          imageUrl: getImageUrl(step.imagePath),
          character: step.character,
          mcuRole: step.mcuRole,
        });
      }

      // Link to previous node
      if (i > 0) {
        const prevStep = path[i - 1];
        const prevId = `${prevStep.type}-${prevStep.id}`;
        const linkId = `${prevId}-${nodeId}`;
        
        if (!linkIds.has(linkId)) {
          linkIds.add(linkId);
          links.push({
            source: prevId,
            target: nodeId,
            label: step.character || undefined,
          });
        }
      }
    }
  }

  return { nodes, links };
}

async function cacheResult(sourceActorId: number, sourceName: string, result: BFSResult) {
  try {
    await prisma.cachedPath.upsert({
      where: { sourceActorId },
      update: {
        pathData: JSON.stringify(result),
        degreesCount: result.degrees,
      },
      create: {
        sourceActorId,
        targetActorId: result.targetActors[0].id,
        sourceName,
        targetName: result.targetActors.length > 1 ? "Multiple Connections" : result.targetActors[0].name,
        degreesCount: result.degrees,
        pathData: JSON.stringify(result),
      },
    });
  } catch (err) {
    console.warn("Failed to cache path:", err);
  }
}

async function cachePathEntities(path: PathStep[]) {
  try {
    for (const step of path) {
      if (step.type === "actor") {
        await prisma.actor.upsert({
          where: { id: step.id },
          update: { name: step.name, profilePath: step.imagePath },
          create: {
            id: step.id,
            name: step.name,
            profilePath: step.imagePath,
            isMcu: !!step.mcuRole,
          },
        });
      } else if (step.type === "movie") {
        await prisma.movie.upsert({
          where: { id: step.id },
          update: { title: step.name, posterPath: step.imagePath },
          create: {
            id: step.id,
            title: step.name,
            posterPath: step.imagePath,
          },
        });
      }
    }
  } catch (err) {
    console.warn("Failed to cache path entities:", err);
  }
}
