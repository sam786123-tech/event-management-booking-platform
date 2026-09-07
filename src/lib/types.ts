export interface EventRow {
  id: string;
  title: string;
  description: string;
  category: string;
  event_date: string;
  venue: string;
  city: string;
  price: number;
  capacity: number;
  image_url: string;
  created_at: string;
}

export interface BookingRow {
  id: string;
  user_id: string;
  event_id: string;
  tickets: number;
  total_price: number;
  status: string;
  created_at: string;
}

export interface BookingWithEvent extends BookingRow {
  events: EventRow | null;
}

export interface ProfileRow {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}
