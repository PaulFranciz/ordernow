'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  menu_item: {
    name: string;
  };
}

interface Order {
  id: string;
  payment_status: string;
  order_type: string;
  total_amount: number;
  branch: {
    name: string;
    address: string;
  };
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchOrder() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            branch:branches(name, address),
            items:order_items(
              quantity,
              unit_price,
              menu_item:menu_items(name)
            )
          `)
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [params.id]);

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!order) return <div className="p-8">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="font-semibold">Order #{order.id}</h2>
          <p className="text-gray-600">Status: {order.payment_status}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Order Details</h3>
          <p>Branch: {order.branch.name}</p>
          <p>Type: {order.order_type}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Items</h3>
          {order.items.map((item: OrderItem) => (
            <div key={item.id} className="flex justify-between py-2">
              <span>{item.menu_item.name} x {item.quantity}</span>
              <span>₦{(item.unit_price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₦{order.total_amount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 