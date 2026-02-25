const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function updatePrices() {
  try {
    console.log("🚀 Starting to update vehicle prices...\n");

    // Get all vehicles
    const vehicles = await prisma.vehicle.findMany();
    console.log(`Found ${vehicles.length} vehicles\n`);

    // Update each vehicle
    for (const vehicle of vehicles) {
      const oldPrice = vehicle.pricePerDay;
      const newPrice = oldPrice * 1000;

      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { pricePerDay: newPrice },
      });

      console.log(
        `✅ ${vehicle.make} ${vehicle.model}: Rs.${oldPrice} → Rs.${newPrice}`,
      );
    }

    console.log("\n✨ All prices updated successfully!");
    console.log("🔄 Please refresh your browser to see the changes.");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePrices();
