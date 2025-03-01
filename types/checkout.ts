export interface DeliveryZone {
  id: number;
  branch_id: number;
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