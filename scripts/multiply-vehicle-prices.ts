/**
 * Script to multiply all vehicle prices by 1000
 * Run with: npx tsx scripts/multiply-vehicle-prices.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function multiplyVehiclePrices() {
  try {
    console.log("Starting to multiply vehicle prices by 1000...");

    // Get all vehicles
    const vehicles = await prisma.vehicle.findMany({
      select: {
        id: true,
        make: true,
        model: true,
        pricePerDay: true,
      },
    });

    console.log(`Found ${vehicles.length} vehicles to update`);

    // Update each vehicle's price
    let updatedCount = 0;
    for (const vehicle of vehicles) {
      const newPrice = vehicle.pricePerDay * 1000;

      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { pricePerDay: newPrice },
      });

      console.log(
        `Updated ${vehicle.make} ${vehicle.model}: Rs. ${vehicle.pricePerDay} → Rs. ${newPrice}`,
      );
      updatedCount++;
    }

    console.log(`\n✅ Successfully updated ${updatedCount} vehicles!`);
    console.log("All vehicle prices have been multiplied by 1000");
  } catch (error) {
    console.error("❌ Error updating vehicle prices:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
multiplyVehiclePrices()
  .then(() => {
    console.log("\n✨ Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
