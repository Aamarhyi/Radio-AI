export type SubscriptionTier = 'free' | 'premium';
export type TripStatus = 'planning' | 'upcoming' | 'ongoing' | 'completed';
export type BudgetTier = 'budget' | 'mid' | 'luxury';
export type CollaboratorRole = 'editor' | 'viewer';
export type CollaboratorStatus = 'pending' | 'accepted' | 'declined';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  preferences_json: Record<string, any>;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  departure_city: string | null;
  start_date: string | null; // ISO Date String
  end_date: string | null; // ISO Date String
  budget_tier: BudgetTier | null;
  budget_amount: number | null;
  travelers: number;
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export interface TripPreference {
  id: string;
  trip_id: string;
  interests_json: string[]; // e.g., ["sightseeing", "nature", "foodie"]
  transportation: string | null; // e.g., "rental_car", "public_transit", "walking"
  accommodation: string | null; // e.g., "hotel", "airbnb", "hostel"
  dietary_restrictions: string[]; // e.g., ["vegan", "gluten-free"]
}

export interface DailyPlan {
  id: string;
  trip_id: string;
  day_number: number;
  date: string | null; // ISO Date String
  weather_json: Record<string, any>;
}

export interface Activity {
  id: string;
  daily_plan_id: string;
  time_slot: string | null; // e.g., "09:00" or "morning"
  title: string;
  description: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  cost: number | null;
  category: string | null; // e.g., "sightseeing", "adventure", "food", "relaxation"
  duration_minutes: number | null;
  booking_url: string | null;
}

export interface Restaurant {
  id: string;
  trip_id: string;
  name: string;
  cuisine: string | null;
  price_range: '$' | '$$' | '$$$' | '$$$$' | null;
  rating: number | null;
  lat: number | null;
  lng: number | null;
  address: string | null;
  dietary_options: string[];
  reservation_url: string | null;
}

export interface Accommodation {
  id: string;
  trip_id: string;
  name: string;
  type: string | null; // e.g., "hotel", "resort", "apartment"
  price_per_night: number | null;
  rating: number | null;
  lat: number | null;
  lng: number | null;
  amenities_json: string[];
  booking_url: string | null;
}

export interface BudgetItem {
  id: string;
  trip_id: string;
  category: string; // e.g., "flights", "hotels", "meals", "transportation", "activities", "shopping", "other"
  amount: number;
  description: string | null;
  date: string | null; // ISO Date String
}

export interface PackingItem {
  id: string;
  trip_id: string;
  category: string; // e.g., "clothing", "toiletries", "electronics", "documents", "other"
  item_name: string;
  is_checked: boolean;
}

export interface Document {
  id: string;
  trip_id: string;
  type: string; // e.g., "flight", "hotel_confirmation", "insurance", "passport", "other"
  name: string;
  file_url: string;
  expiry_date: string | null; // ISO Date String
  notes: string | null;
}

export interface Collaborator {
  id: string;
  trip_id: string;
  user_id: string;
  role: CollaboratorRole;
  status: CollaboratorStatus;
  user?: {
    name: string | null;
    email: string;
    avatar_url: string | null;
  };
}

// Support types for AI itinerary generation & UI
export interface CompleteItinerary {
  trip: Trip;
  preferences: TripPreference | null;
  daily_plans: Array<DailyPlan & { activities: Activity[] }>;
  restaurants: Restaurant[];
  accommodations: Accommodation[];
  budget_items: BudgetItem[];
  packing_items: PackingItem[];
  collaborators: Collaborator[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}
