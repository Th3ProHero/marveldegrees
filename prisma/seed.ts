import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mcuSeedActors = [
  { tmdbId: 3223, name: "Robert Downey Jr.", character: "Iron Man" },
  { tmdbId: 16828, name: "Chris Evans", character: "Captain America" },
  { tmdbId: 74568, name: "Chris Hemsworth", character: "Thor" },
  { tmdbId: 1245, name: "Scarlett Johansson", character: "Black Widow" },
  { tmdbId: 103, name: "Mark Ruffalo", character: "Hulk" },
  { tmdbId: 17604, name: "Jeremy Renner", character: "Hawkeye" },
  { tmdbId: 1136406, name: "Tom Holland", character: "Spider-Man" },
  { tmdbId: 71580, name: "Benedict Cumberbatch", character: "Doctor Strange" },
  { tmdbId: 22226, name: "Paul Rudd", character: "Ant-Man" },
  { tmdbId: 172069, name: "Chadwick Boseman", character: "Black Panther" },
  { tmdbId: 60073, name: "Brie Larson", character: "Captain Marvel" },
  { tmdbId: 91606, name: "Tom Hiddleston", character: "Loki" },
  { tmdbId: 550843, name: "Elizabeth Olsen", character: "Scarlet Witch" },
  { tmdbId: 53650, name: "Anthony Mackie", character: "Falcon" },
  { tmdbId: 60898, name: "Sebastian Stan", character: "Winter Soldier" },
  { tmdbId: 6162, name: "Paul Bettany", character: "Vision" },
  { tmdbId: 2231, name: "Samuel L. Jackson", character: "Nick Fury" },
  { tmdbId: 16851, name: "Josh Brolin", character: "Thanos" },
  { tmdbId: 8691, name: "Zoe Saldana", character: "Gamora" },
  { tmdbId: 73457, name: "Chris Pratt", character: "Star-Lord" },
  { tmdbId: 543530, name: "Dave Bautista", character: "Drax" },
  { tmdbId: 12835, name: "Vin Diesel", character: "Groot (voice)" },
  { tmdbId: 51329, name: "Bradley Cooper", character: "Rocket (voice)" },
  { tmdbId: 543261, name: "Karen Gillan", character: "Nebula" },
  { tmdbId: 25072, name: "Oscar Isaac", character: "Moon Knight" },
  { tmdbId: 1489211, name: "Simu Liu", character: "Shang-Chi" },
  { tmdbId: 1373737, name: "Florence Pugh", character: "Yelena Belova" },
  { tmdbId: 1083010, name: "Letitia Wright", character: "Shuri" },
  { tmdbId: 1896, name: "Don Cheadle", character: "War Machine" },
  { tmdbId: 12052, name: "Gwyneth Paltrow", character: "Pepper Potts" },
];

async function main() {
  console.log("🌱 Seeding MCU core actors...");

  for (const actor of mcuSeedActors) {
    await prisma.mcuSeedActor.upsert({
      where: { tmdbId: actor.tmdbId },
      update: { name: actor.name, character: actor.character },
      create: actor,
    });

    // Also add to Actor table with isMcu flag
    await prisma.actor.upsert({
      where: { id: actor.tmdbId },
      update: { name: actor.name, isMcu: true },
      create: {
        id: actor.tmdbId,
        name: actor.name,
        isMcu: true,
      },
    });
  }

  console.log(`✅ Seeded ${mcuSeedActors.length} MCU actors`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
