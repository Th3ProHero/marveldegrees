/**
 * Complete list of MCU (Marvel Cinematic Universe) movie TMDB IDs.
 * Used to detect if an actor has appeared in any MCU film,
 * even if they're not in the core seed actor list.
 */
export const MCU_MOVIE_IDS = new Set([
  // Phase 1
  1726,   // Iron Man (2008)
  1724,   // The Incredible Hulk (2008)
  10138,  // Iron Man 2 (2010)
  10195,  // Thor (2011)
  1771,   // Captain America: The First Avenger (2011)
  24428,  // The Avengers (2012)

  // Phase 2
  68721,  // Iron Man 3 (2013)
  76338,  // Thor: The Dark World (2013)
  100402, // Captain America: The Winter Soldier (2014)
  118340, // Guardians of the Galaxy (2014)
  99861,  // Avengers: Age of Ultron (2015)
  102899, // Ant-Man (2015)

  // Phase 3
  271110, // Captain America: Civil War (2016)
  284052, // Doctor Strange (2016)
  283995, // Guardians of the Galaxy Vol. 2 (2017)
  315635, // Spider-Man: Homecoming (2017)
  284053, // Thor: Ragnarok (2017)
  284054, // Black Panther (2018)
  299536, // Avengers: Infinity War (2018)
  363088, // Ant-Man and the Wasp (2018)
  299537, // Captain Marvel (2019)
  299534, // Avengers: Endgame (2019)
  429617, // Spider-Man: Far From Home (2019)

  // Phase 4
  497698, // Black Widow (2021)
  566525, // Shang-Chi and the Legend of the Ten Rings (2021)
  524434, // Eternals (2021)
  634649, // Spider-Man: No Way Home (2021)
  453395, // Doctor Strange in the Multiverse of Madness (2022)
  616037, // Thor: Love and Thunder (2022)
  505642, // Black Panther: Wakanda Forever (2022)

  // Phase 5
  640146, // Ant-Man and the Wasp: Quantumania (2023)
  447365, // Guardians of the Galaxy Vol. 3 (2023)
  609681, // The Marvels (2023)
  533535, // Deadpool & Wolverine (2024)

  // Phase 6
  822119, // Captain America: Brave New World (2025)
  986056, // Thunderbolts* (2025)
]);

/** Map from movie ID to title for display purposes */
export const MCU_MOVIE_TITLES: Record<number, string> = {
  1726: "Iron Man",
  1724: "The Incredible Hulk",
  10138: "Iron Man 2",
  10195: "Thor",
  1771: "Captain America: The First Avenger",
  24428: "The Avengers",
  68721: "Iron Man 3",
  76338: "Thor: The Dark World",
  100402: "Captain America: The Winter Soldier",
  118340: "Guardians of the Galaxy",
  99861: "Avengers: Age of Ultron",
  102899: "Ant-Man",
  271110: "Captain America: Civil War",
  284052: "Doctor Strange",
  283995: "Guardians of the Galaxy Vol. 2",
  315635: "Spider-Man: Homecoming",
  284053: "Thor: Ragnarok",
  284054: "Black Panther",
  299536: "Avengers: Infinity War",
  363088: "Ant-Man and the Wasp",
  299537: "Captain Marvel",
  299534: "Avengers: Endgame",
  429617: "Spider-Man: Far From Home",
  497698: "Black Widow",
  566525: "Shang-Chi and the Legend of the Ten Rings",
  524434: "Eternals",
  634649: "Spider-Man: No Way Home",
  453395: "Doctor Strange in the Multiverse of Madness",
  616037: "Thor: Love and Thunder",
  505642: "Black Panther: Wakanda Forever",
  640146: "Ant-Man and the Wasp: Quantumania",
  447365: "Guardians of the Galaxy Vol. 3",
  609681: "The Marvels",
  533535: "Deadpool & Wolverine",
  822119: "Captain America: Brave New World",
  986056: "Thunderbolts*",
};
