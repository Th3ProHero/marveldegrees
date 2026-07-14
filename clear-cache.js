const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing CachedPath and McuSeedActor tables...");
  
  await prisma.cachedPath.deleteMany();
  console.log("✅ Cleared CachedPath");
  
  await prisma.mcuSeedActor.deleteMany();
  console.log("✅ Cleared McuSeedActor");

  console.log("Done.");
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
