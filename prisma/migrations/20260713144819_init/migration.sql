-- CreateTable
CREATE TABLE "actors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "profile_path" TEXT,
    "popularity" REAL NOT NULL DEFAULT 0,
    "is_mcu" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "poster_path" TEXT,
    "release_date" TEXT,
    "overview" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "actor_movies" (
    "actor_id" INTEGER NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "character" TEXT,
    "credit_order" INTEGER,

    PRIMARY KEY ("actor_id", "movie_id"),
    CONSTRAINT "actor_movies_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "actors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "actor_movies_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cached_paths" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source_actor_id" INTEGER NOT NULL,
    "target_actor_id" INTEGER NOT NULL,
    "source_name" TEXT NOT NULL,
    "target_name" TEXT NOT NULL,
    "degrees_count" INTEGER NOT NULL,
    "path_data" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "mcu_seed_actors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "character" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "cached_paths_source_actor_id_idx" ON "cached_paths"("source_actor_id");

-- CreateIndex
CREATE UNIQUE INDEX "cached_paths_source_actor_id_key" ON "cached_paths"("source_actor_id");

-- CreateIndex
CREATE UNIQUE INDEX "mcu_seed_actors_tmdb_id_key" ON "mcu_seed_actors"("tmdb_id");
