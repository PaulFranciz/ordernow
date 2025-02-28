-- Add display_order column to branches table
ALTER TABLE branches 
ADD COLUMN display_order INTEGER NOT NULL DEFAULT 999;

-- Update display order for existing branches
UPDATE branches 
SET display_order = CASE 
    WHEN name LIKE 'Hogis Luxury%' THEN 1
    WHEN name LIKE 'Hogis Royale%' THEN 2
    WHEN name LIKE 'Hogis Exclusive%' THEN 3
    ELSE 999
END; 