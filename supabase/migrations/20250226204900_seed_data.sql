-- Insert branches
INSERT INTO branches (id, name, address, opening_time, closing_time) VALUES
    ('b1000000-0000-0000-0000-000000000001', 'Hogis Royale And Apartment', 'Main Branch, Calabar', '08:00:00', '22:00:00'),
    ('b2000000-0000-0000-0000-000000000002', 'Hogis Luxury Suites', 'Main Branch, Calabar', '08:00:00', '22:00:00'),
    ('b3000000-0000-0000-0000-000000000003', 'Hogis Exclusive Resort', 'Main Branch, Calabar', '08:00:00', '22:00:00');

-- Insert delivery zones for each branch
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
INSERT INTO categories (name) VALUES
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

-- Insert menu items
DO $$
BEGIN
    -- BEER OR CIDERS
    PERFORM insert_menu_items('BEER OR CIDERS', ARRAY[
        ['33 EXPORT', '1500'],
        ['CASTLE LITE', '1500'],
        ['CHAMPION', '1500'],
        ['BUDWISER BIG', '2000'],
        ['BIG SMIRNOFF ICE', '2500'],
        ['DESPERADOS', '1500'],
        ['FLYING FISH', '1500'],
        ['GOLDBERG', '1500'],
        ['GUINESS SMOOTH', '1700'],
        ['GULDER', '1500'],
        ['HARP', '1500'],
        ['HERO', '1500'],
        ['LARGE HEINEKEN', '2000'],
        ['LARGE LEGEND', '2000'],
        ['LARGE STOUT', '2500'],
        ['LEGEND TWIST', '1500'],
        ['LIFE BEER', '1500'],
        ['MEDIUM STOUT', '2000'],
        ['ORIGIN BEER', '1500'],
        ['SMALL SMIRNOFF ICE', '1500'],
        ['SMALL STOUT', '1500'],
        ['STAR BEER', '1500'],
        ['STAR RADLER', '1500'],
        ['TIGER', '1000'],
        ['TROPHY BEER', '1500'],
        ['TROPHY STOUT', '2000']
    ]);

    -- BITTERS(SPIRIT)
    PERFORM insert_menu_items('BITTERS(SPIRIT)', ARRAY[
        ['1960 BITTERS(SMALL)', '1500'],
        ['CAMPARI (BIG)', '35000'],
        ['CAMPARI (MEDIUM)', '25000'],
        ['ELVITA BITTERS', '1500']
    ]);

    -- JUICES
    PERFORM insert_menu_items('JUICES', ARRAY[
        ['5 ALIVE (BIG)', '2000'],
        ['5 ALIVE SMALL', '1000'],
        ['ALL BERRIES SMOOTHIE', '3500'],
        ['CHI ACTIVE', '2500'],
        ['CHI EXOTIC', '2500'],
        ['CHIVITA', '2500'],
        ['NUTRI MILK', '1000'],
        ['NUTRI-YO', '1000'],
        ['PINEAPPLE JUICE (FRUIT REPUBLIC)', '2500'],
        ['PREMIUM ZOBO', '1000'],
        ['SKIN GLOW JUICE', '2500'],
        ['SMALL PINEAPPLE JUICE', '800'],
        ['SMALL WATERMELON JUICE', '800'],
        ['WATERMELON JUICE (FRUIT REPUBLIC)', '2500']
    ]);

    -- SOFT DRINKS OR WATER
    PERFORM insert_menu_items('SOFT DRINKS OR WATER', ARRAY[
        ['AMSTEL MALTA', '1000'],
        ['BELLA WATER 50CL', '300'],
        ['BELLA WATER 75CL', '500'],
        ['BIG CEDAR YOGHURT', '2000'],
        ['COKE', '1000'],
        ['COKE (CAN)', '1000'],
        ['CRANBERRY JUICE', '1000'],
        ['DIVA', '1500'],
        ['DUBIC MALT', '1000'],
        ['FANTA', '1000'],
        ['FAYROUZ', '1000'],
        ['HOLLANDIA YOGHURT', '3500'],
        ['MALTA GUINESS', '1000'],
        ['MALTINA', '1000']
    ]);

    -- RED WINES
    PERFORM insert_menu_items('RED WINES', ARRAY[
        ['4TH STREET', '10000'],
        ['AGOR', '15000'],
        ['B&G', '10000'],
        ['BAMA', '10000'],
        ['CARLO ROSSI', '15000'],
        ['DOMINION', '10000'],
        ['DOMINO', '13000'],
        ['DORADO', '10000'],
        ['DROSDY-HOF', '15000'],
        ['ESCUDO ROJO', '45000'],
        ['EXPRESSION WINE', '13000'],
        ['F&F WINE', '15000'],
        ['FOUR COUSINS RED', '15000'],
        ['MACNELLIS', '18000'],
        ['MATEUS', '12000'],
        ['MOTIVO', '15000'],
        ['RUBIS', '35000'],
        ['STAR CHASER', '10000'],
        ['TOMA', '10000']
    ]);

    -- NON-ALCOHOLIC SWEET WINE
    PERFORM insert_menu_items('NON-ALCOHOLIC SWEET WINE', ARRAY[
        ['4TH STREET (NON ALCOHOLIC)', '10000'],
        ['APOSTROPH MELOT', '10000'],
        ['EISBERG (NON ALCOHOLIC)', '15000'],
        ['ELISBERG', '7000'],
        ['J&W', '10000'],
        ['MARTINELLIS', '18000'],
        ['MARTINELLIS (NON ALCOHOLIC)', '18000'],
        ['MALIBU', '15000'],
        ['TOMA (NON-ALCOHOLIC)', '10000']
    ]);

    -- VODKA OR SPIRIT
    PERFORM insert_menu_items('VODKA OR SPIRIT', ARRAY[
        ['ABSOLUTE VODKA', '35000'],
        ['ABSOLUTE VODKA SHOT', '2000'],
        ['BUEN AMIGO', '40000'],
        ['BUEN AMIGO SHOT', '3500'],
        ['BLACK LABEL SHOT', '3000']
    ]);

    -- COCKTAIL
    PERFORM insert_menu_items('COCKTAIL', ARRAY[
        ['ADIOS MOTHERFUCKER', '4000'],
        ['ALCOHOLIC CHAPMAN', '3000'],
        ['CAPERINER', '4000'],
        ['COSMOPOLITAN', '4000'],
        ['CONTRAEU TOT', '2000'],
        ['DARK & STORMY', '4000'],
        ['DARK SAINT', '4000'],
        ['GIN AND TONIC', '3000'],
        ['GIN FIZZ', '3500'],
        ['HENNESSY BERRY', '7000'],
        ['JACK AND COKE', '3000'],
        ['LEMONADE', '4000'],
        ['LONG ISLAND', '6000'],
        ['MAI TAI', '4000'],
        ['MOJITO', '4000'],
        ['MOSCOW MULE', '4000'],
        ['OLD FASHION', '3000'],
        ['PASSION FRUIT MARTINI', '4000'],
        ['PINA COLADA', '6000'],
        ['QUIET STORM', '4000'],
        ['RUM AND COKE', '3000'],
        ['SALTY DOG', '4000'],
        ['SCREW DRIVER', '4000'],
        ['SEX IN A DRIVEWAY', '5000'],
        ['SEX ON THE BEACH', '5000'],
        ['TEQUILA SUNRISE', '3500'],
        ['TOM COLLINS', '4000'],
        ['WHISKEY HIGHBALL', '4000']
    ]);

    -- SPECIALITIES
    PERFORM insert_menu_items('SPECIALITIES', ARRAY[
        ['ABACHA(WEEKEND SPECIAL)', '2000'],
        ['ASUN JOLLOF RICE', '7000'],
        ['CHEF SPECIAL RICE (BASMATIC)', '7000'],
        ['CHICKEN NKWOBI', '5000']
    ]);

    -- PASTRY
    PERFORM insert_menu_items('PASTRY', ARRAY[
        ['ADMIRAL YOGHURT', '2200'],
        ['AMERICAN HOT CHOCOLATE', '1500'],
        ['BEEF BURGER', '2500'],
        ['BEEF BURGER(DOUBLE DECKER)', '5000'],
        ['BEEF BURGER(SINGLE)', '3000'],
        ['BEEF PIE', '500'],
        ['BEEF SHAWARMA', '3500'],
        ['BREAD ROLLS', '500'],
        ['BUTTER CREAM CAKE', '1000'],
        ['BUTTERED BREAD', '1500'],
        ['CAPPUCCINO', '2000'],
        ['CARROT CAKE', '1000'],
        ['CHICKEN BURGER(DOUBLE DECKER)', '5000'],
        ['CHICKEN PIE', '1000'],
        ['CHICKEN SANDWICH', '2000'],
        ['CHICKEN SHAWARMA', '3500'],
        ['CHOCOLATE BARS', '300'],
        ['CHOCOLATE MOIST CAKE', '1000'],
        ['CLASSIC BREAD', '1500'],
        ['CLUB SANDWICH', '3500'],
        ['COCONUT BREAD', '1600'],
        ['COCONUT CAKE', '1000'],
        ['COCONUT MIKADO', '3000'],
        ['COOKIES', '500'],
        ['CUPCAKE', '500'],
        ['CRUNCHY PLANTAIN CHIPS', '1000'],
        ['DOUGHNUT', '500'],
        ['EXOTIC CAKE', '1000'],
        ['FRESH COCONUT MIX', '2500'],
        ['FRUIT CAKE', '1000'],
        ['FRUIT共和 FRUIT REPUBLIC', '3000'],
        ['GREEK YOGHURT', '3000'],
        ['GREEN TEA', '700'],
        ['GUINESS CAKE', '1000'],
        ['ICED MINT SYRUP', '3500'],
        ['ICED TEA', '3000'],
        ['JUICE ALIVE (FRUIT REPUBLIC)', '3000'],
        ['JUMBO BREAD', '1800'],
        ['JUMBO SANDWICH', '2000'],
        ['LIME SHOT', '2000'],
        ['MAIZEN CAKE', '1000'],
        ['MAIZEN DOUGHNUT', '500'],
        ['MEAT PIE', '1000'],
        ['MILKY DOUGHNUT X1', '1000'],
        ['MILKY DOUGHNUT X2', '2500'],
        ['MILKY DOUGHNUT X3', '3500'],
        ['MILKY DOUGHNUT X6', '6500'],
        ['MINI CHOPS', '1000'],
        ['MOCKTAIL', '2500'],
        ['MOIST MUFFINS', '500'],
        ['PANCAKE & HONEY SYRUP', '3000'],
        ['PARFAIT IN BOWL', '10000'],
        ['POPCORN', '500'],
        ['PORK SHAWARMA', '4500'],
        ['PREMIUM NUT DRINK (FRUIT REPUBLIC)', '2500'],
        ['RAINBOW CAKE', '1000'],
        ['RED VELVET CAKE', '1000'],
        ['SANDWICH', '2000'],
        ['SAUSAGE', '500'],
        ['SAUSAGE ROLL', '500'],
        ['SAUSAGE SHAWARMA', '1500'],
        ['SCOTCHED EGG', '500'],
        ['SKIN GLOW', '2500'],
        ['SMALL CHOP', '2500'],
        ['SMALL CHOP(S)', '1500'],
        ['SMALL CUP CAKES', '500'],
        ['SMOOTHIE (FRUIT REPUBLIC)', '3000'],
        ['SPRING ROLLS (CHICKEN & CHIPS)', '4500'],
        ['TOAST BREAD', '700'],
        ['VEGAN ROLL', '350'],
        ['VEGETERIAN SHAWARMA', '1000'],
        ['WHEAT BREAD', '1500'],
        ['YADHA YOGHURT', '2500'],
        ['YELLY DOUGHNUT', '500']
    ]);

    -- SOUP
    PERFORM insert_menu_items('SOUP', ARRAY[
        ['AFANG SOUP', '2500'],
        ['BANGA SOUP', '3000'],
        ['BITTERLEAF SOUP', '2500'],
        ['OGBONO SOUP', '2500'],
        ['OHA SOUP', '2500'],
        ['OKRO SOUP', '2500'],
        ['SEA FOOD OKRO', '7500'],
        ['WHITE SOUP', '3000'],
        ['EGUSI SOUP', '2500'],
        ['EDIKAIKONG (VEGETABLE SOUP)', '2500']
    ]);

    -- CHAMPAGNE
    PERFORM insert_menu_items('CHAMPAGNE', ARRAY[
        ['ANDRE ROSE', '25000'],
        ['ANDRE BRUT', '25000'],
        ['TORLEY', '25000']
    ]);

    -- SPARKLING WINE
    PERFORM insert_menu_items('SPARKLING WINE', ARRAY[
        ['BELAIRE', '120000'],
        ['CHAMDOR', '12000'],
        ['HENKELL DRY-SEC', '10000'],
        ['MARTINI ROSE', '50000'],
        ['MOET BRUT', '200000'],
        ['MOET ROSE', '230000'],
        ['NEW AGE WINE(RED)', '15000'],
        ['SCOTTISH LEADER', '25000'],
        ['TWO OCEANS', '12000']
    ]);

    -- MILKSHAKE
    PERFORM insert_menu_items('MILKSHAKE', ARRAY[
        ['BANANA MILKSHAKE', '3000'],
        ['CHOCOLATE MILKSHAKE', '3000'],
        ['STRAWBERRY MILKSHAKE', '3000'],
        ['VANILLA MILKSHAKE', '3000']
    ]);

    -- DESERT
    PERFORM insert_menu_items('DESERT', ARRAY[
        ['BANANA SPLIT', '3500'],
        ['CHOCOLATE SUNDAE', '3500'],
        ['FRUIT SALAD', '3000'],
        ['ICE CREAM (CHOCOLATE)', '2500'],
        ['ICE CREAM (STRAWBERRY)', '2500'],
        ['ICE CREAM (VANILLA)', '2500'],
        ['MIXED FRUIT SALAD', '3500'],
        ['PARFAIT', '3500'],
        ['STRAWBERRY SUNDAE', '3500'],
        ['VANILLA SUNDAE', '3500']
    ]);

    -- SEA FOOD MENU
    PERFORM insert_menu_items('SEA FOOD MENU', ARRAY[
        ['CROAKER FISH', '7000'],
        ['GRILLED FISH', '7000'],
        ['GRILLED FISH WITH CHIPS', '8500'],
        ['GRILLED FISH WITH PLANTAIN', '8500'],
        ['GRILLED FISH WITH YAM', '8500'],
        ['PEPPER SOUP FISH', '7000'],
        ['RED SNAPPER', '7000']
    ]);

    -- LIGHT MEAL
    PERFORM insert_menu_items('LIGHT MEAL', ARRAY[
        ['BEANS', '1500'],
        ['BEANS AND PLANTAIN', '2500'],
        ['CHICKEN AND CHIPS', '4500'],
        ['CHICKEN WINGS', '3500'],
        ['CHIPS', '2000'],
        ['CHIPS AND EGG', '2500'],
        ['CHIPS AND PLANTAIN', '2500'],
        ['CHIPS AND SAUSAGE', '2500'],
        ['FISH AND CHIPS', '4500'],
        ['FRIED RICE', '2500'],
        ['JOLLOF RICE', '2500'],
        ['NOODLES', '2000'],
        ['NOODLES AND EGG', '2500'],
        ['NOODLES AND PLANTAIN', '2500'],
        ['NOODLES AND SAUSAGE', '2500'],
        ['PLANTAIN', '1500'],
        ['PLANTAIN AND EGG', '2500'],
        ['PLANTAIN AND SAUSAGE', '2500'],
        ['RICE AND BEANS', '3000'],
        ['RICE AND STEW', '3000'],
        ['YAM', '1500'],
        ['YAM AND EGG', '2500'],
        ['YAM AND PLANTAIN', '2500'],
        ['YAM AND SAUSAGE', '2500']
    ]);

    -- GRILL LOUNGE
    PERFORM insert_menu_items('GRILL LOUNGE', ARRAY[
        ['ASUN', '5000'],
        ['BEEF SUYA', '3500'],
        ['CHICKEN SUYA', '3500'],
        ['GRILLED CHICKEN', '4500'],
        ['GRILLED CHICKEN WITH CHIPS', '6000'],
        ['GRILLED CHICKEN WITH JOLLOF', '6000'],
        ['GRILLED CHICKEN WITH FRIED RICE', '6000'],
        ['GRILLED FISH', '7000'],
        ['GRILLED TURKEY', '4500'],
        ['NKWOBI', '5000'],
        ['PEPPERED CHICKEN', '4500'],
        ['PEPPERED GIZZARD', '3500'],
        ['PEPPERED SNAIL', '5000'],
        ['PEPPERED TURKEY', '4500']
    ]);

    -- MOCKTAILS
    PERFORM insert_menu_items('MOCKTAILS', ARRAY[
        ['CHAPMAN', '2500'],
        ['FRUIT PUNCH', '2500'],
        ['MOJITO', '2500'],
        ['PINA COLADA', '2500'],
        ['SHIRLEY TEMPLE', '2500'],
        ['VIRGIN MARY', '2500']
    ]);

    -- RICE
    PERFORM insert_menu_items('RICE', ARRAY[
        ['COCONUT RICE', '3000'],
        ['FRIED RICE', '2500'],
        ['JOLLOF RICE', '2500'],
        ['NATIVE RICE', '3000'],
        ['OFADA RICE', '3000'],
        ['RICE AND BEANS', '3000'],
        ['RICE AND STEW', '3000'],
        ['SPECIAL FRIED RICE', '3500'],
        ['SPECIAL JOLLOF RICE', '3500']
    ]);

    -- SALAD
    PERFORM insert_menu_items('SALAD', ARRAY[
        ['COLESLAW', '1500'],
        ['GREEK SALAD', '3000'],
        ['MIXED SALAD', '3000']
    ]);

    -- INDIAN
    PERFORM insert_menu_items('INDIAN', ARRAY[
        ['BUTTER CHICKEN', '5000'],
        ['CHICKEN TIKKA MASALA', '5000'],
        ['NAAN BREAD', '1500']
    ]);

    -- QUICKSTART
    PERFORM insert_menu_items('QUICKSTART', ARRAY[
        ['BEEF BURGER', '2500'],
        ['CHICKEN BURGER', '2500'],
        ['CLUB SANDWICH', '3500'],
        ['FISH BURGER', '2500']
    ]);

    -- CHINESE
    PERFORM insert_menu_items('CHINESE', ARRAY[
        ['CHICKEN FRIED RICE', '3500'],
        ['CHICKEN NOODLES', '3500'],
        ['SPECIAL FRIED RICE', '3500'],
        ['SPECIAL NOODLES', '3500']
    ]);

    -- ORIENTAL/CONTINENTAL
    PERFORM insert_menu_items('ORIENTAL/CONTINENTAL', ARRAY[
        ['CHICKEN CURRY', '4500'],
        ['CHICKEN STIR FRY', '4500']
    ]);
END $$; 