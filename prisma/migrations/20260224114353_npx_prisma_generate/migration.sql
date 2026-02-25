-- CreateIndex
CREATE INDEX "Vehicle_status_location_idx" ON "Vehicle"("status", "location");

-- CreateIndex
CREATE INDEX "Vehicle_status_pricePerDay_idx" ON "Vehicle"("status", "pricePerDay");
