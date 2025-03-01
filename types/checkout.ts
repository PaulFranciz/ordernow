export interface DeliveryZone {
  id: string;
  name: string;
  branch_id: string;
  location: string;
  vehicle_type: string;
  daytime_fee: number;
  night_fee: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
} 