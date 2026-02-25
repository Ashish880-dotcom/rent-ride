const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function removeTVSJupiter() {
  try {
    console.log("🔍 Looking for TVS Jupiter...\n");

    // Find TVS Jupiter
    const tvsJupiter = await prisma.vehicle.findFirst({
      where: {
        OR: [
          { make: { contains: "TVS", mode: "insensitive" } },
          { model: { contains: "Jupiter", mode: "insensitive" } },
        ],
      },
    });

    if (!tvsJupiter) {
      console.log("❌ TVS Jupiter not found in database");
      return;
    }

    console.log(`Found: ${tvsJupiter.make} ${tvsJupiter.model}`);
    console.log(`Price: Rs.${tvsJupiter.pricePerDay}/day`);
    console.log(`ID: ${tvsJupiter.id}\n`);

    // Delete the vehicle
    await prisma.vehicle.delete({
      where: { id: tvsJupiter.id },
    });

    console.log("✅ TVS Jupiter has been removed from the database!");
    console.log("🔄 Please refresh your browser to see the changes.");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

removeTVSJupiter();
