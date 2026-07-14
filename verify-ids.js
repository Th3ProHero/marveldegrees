// Verify all MCU seed actor TMDB IDs against the actual TMDB API
const API_KEY = "d594259650afe3d9396b0fd516ef9f6d";

const seedActors = [
  { tmdbId: 3223, name: "Robert Downey Jr." },
  { tmdbId: 16828, name: "Chris Evans" },
  { tmdbId: 74568, name: "Chris Hemsworth" },
  { tmdbId: 1245, name: "Scarlett Johansson" },
  { tmdbId: 103, name: "Mark Ruffalo" },
  { tmdbId: 17604, name: "Jeremy Renner" },
  { tmdbId: 1136406, name: "Tom Holland" },
  { tmdbId: 71580, name: "Benedict Cumberbatch" },
  { tmdbId: 16867, name: "Paul Rudd" },
  { tmdbId: 172069, name: "Chadwick Boseman" },
  { tmdbId: 60073, name: "Brie Larson" },
  { tmdbId: 91606, name: "Tom Hiddleston" },
  { tmdbId: 550843, name: "Elizabeth Olsen" },
  { tmdbId: 53650, name: "Anthony Mackie" },
  { tmdbId: 60898, name: "Sebastian Stan" },
  { tmdbId: 6162, name: "Paul Bettany" },
  { tmdbId: 2231, name: "Samuel L. Jackson" },
  { tmdbId: 16851, name: "Josh Brolin" },
  { tmdbId: 8691, name: "Zoe Saldana" },
  { tmdbId: 73457, name: "Chris Pratt" },
  { tmdbId: 543530, name: "Dave Bautista" },
  { tmdbId: 12835, name: "Vin Diesel" },
  { tmdbId: 51329, name: "Bradley Cooper" },
  { tmdbId: 543261, name: "Karen Gillan" },
  { tmdbId: 25072, name: "Oscar Isaac" },
  { tmdbId: 1489211, name: "Simu Liu" },
  { tmdbId: 1373737, name: "Florence Pugh" },
  { tmdbId: 1397778, name: "Letitia Wright" },
  { tmdbId: 1896, name: "Don Cheadle" },
  { tmdbId: 11181, name: "Gwyneth Paltrow" },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verify() {
  const mismatches = [];
  
  for (const actor of seedActors) {
    const url = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(actor.name)}`;
    const res = await fetch(url);
    const data = await res.json();
    
    const match = data.results && data.results[0];
    if (!match) {
      console.log(`❓ ${actor.name}: NOT FOUND on TMDB`);
      continue;
    }
    
    if (match.id === actor.tmdbId) {
      console.log(`✅ ${actor.name}: ID ${actor.tmdbId} is CORRECT`);
    } else {
      console.log(`❌ ${actor.name}: Seed ID=${actor.tmdbId}, Real ID=${match.id} → MISMATCH!`);
      mismatches.push({ name: actor.name, seedId: actor.tmdbId, realId: match.id });
    }
    
    await sleep(250); // Rate limit
  }
  
  console.log("\n\n=== SUMMARY ===");
  if (mismatches.length === 0) {
    console.log("All IDs are correct! 🎉");
  } else {
    console.log(`Found ${mismatches.length} mismatches:`);
    for (const m of mismatches) {
      console.log(`  ${m.name}: ${m.seedId} → should be ${m.realId}`);
    }
  }
}

verify();
