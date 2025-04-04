export type OrderType = 'dine-in' | 'pick-up' | 'delivery';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type VehicleType = 'motorbike' | 'bicycle';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Branch {
  id: string;
  name: string;
  address: string;
  opening_time: string;
  closing_time: string;
  status?: 'open' | 'closed';
  openingHours?: string;
  distance?: string;
}

export interface DeliveryZone {
  id: string;
  branch_id: string;
  location: string;
  vehicle_type: VehicleType;
  daytime_fee: number;
  night_fee: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

export interface MenuItem {
  image: string;
  id: string;
  name: string;
  category_id: string;
  price: number;
  description?: string;
  image_url?: string;
  is_available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  user_id: string;
  branch_id: string;
  order_type: OrderType;
  delivery_zone_id?: string;
  status: OrderStatus;
  total_amount: number;
  delivery_fee?: number;
  special_instructions?: string;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  branch_id: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  status: ReservationStatus;
  special_requests?: string;
}

export interface DeliveryFeeCalculation {
  base_fee: number;
  night_surcharge?: number;
  sunday_surcharge?: number;
  total_fee: number;
}

export interface CreateOrderRequest {
  branch_id: string;
  order_type: OrderType;
  delivery_zone_id?: string;
  items: {
    menu_item_id: string;
    quantity: number;
    notes?: string;
  }[];
  special_instructions?: string;
  delivery_address?: string;
}

export interface CreateReservationRequest {
  branch_id: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  special_requests?: string;
}

export interface Location {
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}