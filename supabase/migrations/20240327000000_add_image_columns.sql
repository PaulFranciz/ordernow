-- Add image_url to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add additional fields to menu_items table
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS calories INTEGER,
ADD COLUMN IF NOT EXISTS preparation_time INTEGER, -- in minutes
ADD COLUMN IF NOT EXISTS ingredients TEXT[];

-- Create index for popular items
CREATE INDEX IF NOT EXISTS idx_menu_items_popular ON menu_items(is_popular) WHERE is_popular = true;

-- Create index for available items
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available) WHERE is_available = true;

-- Update existing items to be available by default
UPDATE menu_items SET is_available = true WHERE is_available IS NULL; 