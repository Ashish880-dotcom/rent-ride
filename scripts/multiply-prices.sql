-- SQL Script to multiply all vehicle prices by 1000
-- This will update the pricePerDay column in the Vehicle table

UPDATE "Vehicle"
SET "pricePerDay" = "pricePerDay" * 1000;

-- To verify the changes, you can run:
-- SELECT id, make, model, "pricePerDay" FROM "Vehicle";
