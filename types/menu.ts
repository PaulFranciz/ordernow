export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  is_available?: boolean;
  category_id?: string;
  category_name?: string;
} 