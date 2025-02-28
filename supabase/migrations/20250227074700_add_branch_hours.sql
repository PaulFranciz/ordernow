-- Add opening_time and closing_time columns to branches table
ALTER TABLE branches 
ADD COLUMN opening_time TIME NOT NULL DEFAULT '08:00:00',
ADD COLUMN closing_time TIME NOT NULL DEFAULT '22:00:00'; 