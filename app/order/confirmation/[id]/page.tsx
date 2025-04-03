'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CheckCircle, Package, Utensils, Truck, AlertTriangle } from 'lucide-react';

// --- Type Definitions ---

interface MenuItemInfo {
  name: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  notes?: string | null;
  menu_item: MenuItemInfo | null; // Represents the processed menu item info
}

interface BranchInfo {
  name: string;
  address: string;
}

interface Order {
  id: string;
  status: string;
  order_type: string;
  total_amount: number;
  delivery_fee?: number | null;
  special_instructions?: string | null;
  created_at: string;
  branch: BranchInfo | null; // Processed branch info
  items: OrderItem[]; // Array of processed items
}

// Type for the raw Supabase query result for an order item's menu item relationship
// Supabase might return an object, an array, or null
type RawMenuItemRelation = MenuItemInfo | MenuItemInfo[] | null;

// Type for the raw Supabase query result for an order item
interface RawOrderItemData {
  id: string;
  quantity: number;
  unit_price: number;
  notes?: string | null;
  menu_item: RawMenuItemRelation;
}

// Type for the raw Supabase query result for the branch relationship
type RawBranchRelation = BranchInfo | BranchInfo[] | null;

// Type for the top-level raw Supabase query result for an order
interface RawOrderData {
  id: string;
  status: string;
  order_type: string;
  total_amount: number;
  delivery_fee?: number | null;
  special_instructions?: string | null;
  created_at: string;
  branch: RawBranchRelation;
  items: RawOrderItemData[];
}

// --- Helper Functions ---

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
  } catch (e) {
      return "Invalid Date";
  }
};

const getOrderTypeDetails = (type: string) => {
  switch (type) {
    case 'dine-in': return { name: 'Dine-In', Icon: Utensils };
    case 'pick-up': return { name: 'Pick-Up', Icon: Package };
    case 'delivery': return { name: 'Delivery', Icon: Truck };
    default: return { name: type, Icon: Package };
  }
};

// --- Component ---

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!orderId) {
        setError("Order ID not found in URL.");
        setIsLoading(false);
        return;
    }

    async function fetchOrder() {
      try {
        setIsLoading(true);
        setError(null);

        const { data: rawData, error: fetchError } = await supabase
          .from('orders')
          .select(`
            id, status, order_type, total_amount, delivery_fee,
            special_instructions, created_at,
            branch:branches(name, address),
            items:order_items(
              id, quantity, unit_price, notes,
              menu_item:menu_items(name)
            )
          `)
          .eq('id', orderId)
          .maybeSingle();

        if (fetchError) {
            console.error('Supabase fetch error:', fetchError);
            throw new Error(fetchError.message || 'Failed to fetch order details.');
        }

        if (!rawData) {
            setError(`Order with ID ${orderId} not found.`);
        } else {
            // Safely process the raw data
            const queryResult = rawData as RawOrderData; // Cast to our raw type

            // Process branch
            let processedBranch: BranchInfo | null = null;
            if (queryResult.branch) {
                processedBranch = Array.isArray(queryResult.branch)
                    ? queryResult.branch[0] ?? null
                    : queryResult.branch;
            }

            // Process items
            const processedItems: OrderItem[] = queryResult.items.map((rawItem: RawOrderItemData) => {
                let processedMenuItem: MenuItemInfo | null = null;
                if (rawItem.menu_item) {
                    processedMenuItem = Array.isArray(rawItem.menu_item)
                        ? rawItem.menu_item[0] ?? null
                        : rawItem.menu_item;
                }

                return {
                    id: rawItem.id,
                    quantity: rawItem.quantity,
                    unit_price: rawItem.unit_price,
                    notes: rawItem.notes,
                    menu_item: processedMenuItem ?? { name: '[Item Unavailable]' } // Fallback if null
                };
            });

            // Construct the final typed Order object
            const finalOrder: Order = {
                id: queryResult.id,
                status: queryResult.status,
                order_type: queryResult.order_type,
                total_amount: queryResult.total_amount,
                delivery_fee: queryResult.delivery_fee,
                special_instructions: queryResult.special_instructions,
                created_at: queryResult.created_at,
                branch: processedBranch,
                items: processedItems,
            };

            setOrder(finalOrder);
        }

      } catch (err: any) {
        console.error('Error processing order data:', err);
        setError(err.message || 'An unexpected error occurred while loading order details.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, supabase]);

  // --- Render States ---

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading Order Details...</p>
            </div>
        </div>
    );
  }

  if (error) {
      return (
        <div className="max-w-2xl mx-auto p-8 text-center">
            <div className="flex items-center justify-center bg-red-100 p-4 rounded border border-red-300 text-red-700">
                 <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                 <span>{error}</span>
            </div>
        </div>
      );
  }

  if (!order) {
      return (
        <div className="max-w-2xl mx-auto p-8 text-center">
            <p className="text-gray-700">Order details could not be loaded.</p>
        </div>
      );
  }

  // --- Main Content Rendering ---

  const { name: orderTypeName, Icon: OrderTypeIcon } = getOrderTypeDetails(order.order_type);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white flex items-center space-x-3">
           <CheckCircle className="h-8 w-8 flex-shrink-0" />
           <div>
              <h1 className="text-2xl font-semibold">Order Confirmed!</h1>
              <p className="text-sm opacity-90">Thank you for your order.</p>
           </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
            {/* Order Summary */}
            <div className="border-b pb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                    <p><strong className="font-medium text-gray-900">Order ID:</strong> {order.id}</p>
                    <p><strong className="font-medium text-gray-900">Date:</strong> {formatDate(order.created_at)}</p>
                    <p><strong className="font-medium text-gray-900">Status:</strong> <span className="capitalize font-medium text-emerald-700">{order.status}</span></p>
                    <div className="flex items-center">
                       <OrderTypeIcon className="w-4 h-4 mr-1.5 text-gray-600" />
                       <strong className="font-medium text-gray-900">Type:</strong>&nbsp;{orderTypeName}
                    </div>
                </div>
            </div>

            {/* Branch Details */}
            <div className="border-b pb-4">
                <h3 className="text-md font-semibold text-gray-800 mb-2">Branch Details</h3>
                {order.branch ? (
                    <>
                        <p className="text-sm text-gray-700">{order.branch.name}</p>
                        <p className="text-sm text-gray-600">{order.branch.address}</p>
                    </>
                ) : (
                    <p className="text-sm text-gray-500 italic">Branch details not available.</p>
                )}
            </div>

            {/* Items List */}
            <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">Items Ordered</h3>
                <ul className="space-y-3">
                {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between items-start text-sm border-b border-gray-100 pb-2">
                    <div>
                        {/* Safely access menu_item name */}
                        <span className="font-medium text-gray-900">{item.menu_item?.name ?? 'Item Name Unavailable'}</span>
                        <span className="text-gray-600"> x {item.quantity}</span>
                        {item.notes && <p className="text-xs text-gray-500 italic mt-1">Note: {item.notes}</p>}
                    </div>
                    <span className="font-medium text-gray-800">₦{(item.unit_price * item.quantity).toLocaleString()}</span>
                    </li>
                ))}
                </ul>
            </div>

            {/* Special Instructions */}
            {order.special_instructions && (
                <div className="border-t pt-4">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">Special Instructions</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{order.special_instructions}</p>
                </div>
            )}

            {/* Totals Section */}
            <div className="border-t border-gray-200 pt-4 space-y-1 text-sm">
                {order.delivery_fee && order.delivery_fee > 0 && (
                    <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₦{order.delivery_fee.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between font-semibold text-lg text-gray-900">
                    <span>Total Amount</span>
                    <span>₦{order.total_amount.toLocaleString()}</span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}