-- Create a function to handle order creation
CREATE OR REPLACE FUNCTION create_order(
    p_user_id UUID,
    p_branch_id UUID,
    p_order_type order_type,
    p_delivery_zone_id UUID,
    p_special_instructions TEXT,
    p_items JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_total_amount DECIMAL(10,2) := 0;
    v_delivery_fee DECIMAL(10,2) := 0;
    v_item JSONB;
    v_menu_item RECORD;
BEGIN
    -- Start transaction
    BEGIN
        -- Calculate delivery fee if applicable
        IF p_order_type = 'delivery' THEN
            SELECT 
                CASE 
                    WHEN EXTRACT(HOUR FROM CURRENT_TIME) >= 18 OR EXTRACT(HOUR FROM CURRENT_TIME) < 6 
                    THEN night_fee
                    ELSE daytime_fee
                END + 
                CASE 
                    WHEN EXTRACT(DOW FROM CURRENT_DATE) = 0 -- Sunday
                    THEN 100
                    ELSE 0
                END
            INTO v_delivery_fee
            FROM delivery_zones
            WHERE id = p_delivery_zone_id;

            IF v_delivery_fee IS NULL THEN
                RAISE EXCEPTION 'Invalid delivery zone';
            END IF;
        END IF;

        -- Create the order
        INSERT INTO orders (
            user_id,
            branch_id,
            order_type,
            delivery_zone_id,
            status,
            delivery_fee,
            special_instructions,
            total_amount
        ) VALUES (
            p_user_id,
            p_branch_id,
            p_order_type,
            p_delivery_zone_id,
            'pending',
            v_delivery_fee,
            p_special_instructions,
            0 -- Will update this after adding items
        ) RETURNING id INTO v_order_id;

        -- Process each item
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
        LOOP
            -- Get menu item details
            SELECT id, price, is_available 
            INTO v_menu_item 
            FROM menu_items 
            WHERE id = (v_item->>'menu_item_id')::UUID;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Menu item not found: %', v_item->>'menu_item_id';
            END IF;

            IF NOT v_menu_item.is_available THEN
                RAISE EXCEPTION 'Menu item not available: %', v_item->>'menu_item_id';
            END IF;

            -- Insert order item
            INSERT INTO order_items (
                order_id,
                menu_item_id,
                quantity,
                unit_price,
                subtotal,
                notes
            ) VALUES (
                v_order_id,
                v_menu_item.id,
                (v_item->>'quantity')::INTEGER,
                v_menu_item.price,
                v_menu_item.price * (v_item->>'quantity')::INTEGER,
                v_item->>'notes'
            );

            -- Add to total
            v_total_amount := v_total_amount + (v_menu_item.price * (v_item->>'quantity')::INTEGER);
        END LOOP;

        -- Update order total
        UPDATE orders 
        SET total_amount = v_total_amount + v_delivery_fee
        WHERE id = v_order_id;

        -- Return the created order
        RETURN jsonb_build_object(
            'id', v_order_id,
            'total_amount', v_total_amount + v_delivery_fee,
            'delivery_fee', v_delivery_fee
        );

    EXCEPTION WHEN OTHERS THEN
        -- Rollback will happen automatically
        RAISE;
    END;
END;
$$; 