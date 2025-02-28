-- Insert branches
INSERT INTO branches (id, name, address) VALUES
    ('b1000000-0000-0000-0000-000000000001', 'Hogis Royale And Apartment', 'Main Branch, Calabar'),
    ('b2000000-0000-0000-0000-000000000002', 'Hogis Luxury Suites', 'Main Branch, Calabar'),
    ('b3000000-0000-0000-0000-000000000003', 'Hogis Exclusive Resort', 'Main Branch, Calabar');

-- Insert delivery zones for each branch
-- Helper function to insert delivery zones
DO $$
DECLARE
    branch_ids UUID[] := ARRAY[
        'b1000000-0000-0000-0000-000000000001',
        'b2000000-0000-0000-0000-000000000002',
        'b3000000-0000-0000-0000-000000000003'
    ];
    branch_id UUID;
BEGIN
    FOREACH branch_id IN ARRAY branch_ids
    LOOP
        -- Motorbike zones
        INSERT INTO delivery_zones (branch_id, location, vehicle_type, daytime_fee, night_fee) VALUES
        (branch_id, 'Marian (Ediba, Effio Ette, Atekong, parts of State Housing, up to Ekong Etta)', 'motorbike', 1600, 1900),
        (branch_id, 'Rabana / Biqua / Road Safety / Parliamentary / MCC / Asari Eso / State Housing / UNICAL / Etagbor', 'motorbike', 1900, 2200),
        (branch_id, 'Ekorinim / WAPI / Ikot Ishie / Diamond Hill / Spring Road / UNICAL / Etagbor / Parliamentary Ext. / Akai Ifa / Highway', 'motorbike', 1900, 2200),
        (branch_id, 'E1–E2 Estate', 'motorbike', 2500, 2800),
        (branch_id, 'CRUTECH / 8 Miles / Basin / Tinapa / Scanobo', 'motorbike', 2900, 3200),
        (branch_id, 'Akpabuyo', 'motorbike', 6700, 7000);

        -- Bicycle zones
        INSERT INTO delivery_zones (branch_id, location, vehicle_type, daytime_fee, night_fee) VALUES
        (branch_id, 'Marian (Ediba, Effio Ette, Atekong, parts of State Housing, up to Ekong Etta)', 'bicycle', 1000, 1400),
        (branch_id, 'Rabana / Biqua / Road Safety / Parliamentary / MCC / Asari Eso / State Housing', 'bicycle', 1200, 1600),
        (branch_id, 'Airport – Stadium', 'bicycle', 1400, 1800),
        (branch_id, 'Ekorinim (First Bank side) / Navy Hospital', 'bicycle', 1600, 2000),
        (branch_id, 'Parliamentary (Powerplant to Flyover)', 'bicycle', 1700, 2100),
        (branch_id, 'CRUTECH', 'bicycle', 2000, 2400);
    END LOOP;
END $$;

-- Insert categories
INSERT INTO categories (name, image_url) VALUES
('BEER OR CIDERS'),
('BITTERS(SPIRIT)'),
('RED WINES'),
('NON-ALCOHOLIC SWEET WINE'),
('JUICES'),
('SPECIALITIES'),
('VODKA OR SPIRIT'),
('COCKTAIL'),
('PASTRY'),
('SOUP'),
('APPETIZER'),
('HOGIS LATTE/TEA MENU'),
('BREAKFAST'),
('WHISKY OR BRANDY'),
('SOFT DRINKS OR WATER'),
('CHAMPAGNE'),
('CREAM'),
('ENERGY DRINKS'),
('MILKSHAKE'),
('PROTEIN'),
('PEPPERSOUP'),
('LIGHT MEAL'),
('GRILL LOUNGE'),
('MOCKTAILS'),
('RICE'),
('SALAD'),
('INDIAN'),
('QUICKSTART'),
('DESERT'),
('CHINESE'),
('ORIENTAL/CONTINENTAL'),
('SAUCE'),
('ROOTS OR BITTERS'),
('SPARKLING WINE'),
('WHITE WINE'),
('CIDERS OR RTD'),
('FROM FLOUR'),
('SEA FOOD MENU'),
('FRESH JUICES'),
('GRILLS'),
('BRANDY/COGNAC');

-- Create function to insert menu items for a category
CREATE OR REPLACE FUNCTION insert_menu_items(category_name TEXT, items TEXT[][])
RETURNS void AS $$
DECLARE
    cat_id UUID;
    item TEXT[];
BEGIN
    -- Get category ID
    SELECT id INTO cat_id FROM categories WHERE name = category_name;
    
    -- Insert each item
    FOREACH item SLICE 1 IN ARRAY items
    LOOP
        INSERT INTO menu_items (name, category_id, price)
        VALUES (item[1], cat_id, (item[2])::DECIMAL);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Including all menu items from seed_menu_items.sql
\ir 'seed_menu_items.sql'

-- Add indexes for better query performance
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_branch ON orders(branch_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_branch ON reservations(branch_id);
CREATE INDEX idx_delivery_zones_branch ON delivery_zones(branch_id);