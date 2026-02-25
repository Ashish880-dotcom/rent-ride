-- SQL Script to multiply all vehicle prices by 1000
-- This will make vehicles much more expensive
-- Example: Rs. 149 becomes Rs. 149,000

UPDATE "Vehicle"
SET "pricePerDay" = "pricePerDay" * 1000;

-- After running this:
-- Tesla Model S: Rs. 149 → Rs. 149,000/day
-- BMW X5 M Sport: Rs. 129 → Rs. 129,000/day
-- Mercedes C-Class AMG: Will be multiplied by 1000
-- Porsche 911 Carrera: Will be multiplied by 1000
