export interface Branch {
  id: string;
  name: string;
  address: string;
  opening_time: string;
  closing_time: string;
  status: 'open' | 'closed';
  openingHours: string;
  distance?: string;
}