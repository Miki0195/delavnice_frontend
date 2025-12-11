// Workshop Types
export interface Workshop {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  kind: 'SERVICE' | 'EVENT';
  category: string;
  region: string;
  address?: string;
  latitude?: string | null;
  longitude?: string | null;
  target_group: string;
  program_duration: string;
  duration?: string; // Alias for program_duration
  event_date: string | null;
  event_date_start?: string; // Alias for event_date
  event_date_end?: string | null;
  is_published: boolean;
  is_verified: boolean;
  is_edited?: boolean;
  is_renewal?: boolean;
  previous_version_id?: number | null;
  average_rating: number;
  ratings_count: number;
  views_count: number;
  bookmarks_count?: number;
  price_min: number | null;
  price_max: number | null;
  image_url?: string;
  image?: string;
  provider: {
    id: number;
    organization_name: string;
  };
  provider_id?: number;
  provider_user_id?: number;
  provider_name?: string;
  provider_profile_picture?: string;
  provider_phone?: string;
  provider_email?: string;
  provider_website?: string;
  category_display?: string;
  region_display?: string;
  activity_types: ActivityType[];
  features: Feature[];
  services: Service[];
  available_slots?: AvailableSlot[];
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  title?: string; // Alias for name
  description: string;
  price_eur: number;
  is_free: boolean;
  sessions_count: number;
  session_duration_minutes: number;
  duration_minutes?: number; // Alias for session_duration_minutes
  capacity?: number;
}

export interface AvailableSlot {
  id: number;
  start_datetime: string;
  end_datetime: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityType {
  id: number;
  code: string;
  name: string;
}

export interface Feature {
  id: number;
  code: string;
  name: string;
}

// Category and Region choices (matching Django backend)
export const CATEGORIES = [
  { code: 'AKTIVNO_DRZAVLJANSTVO', label: 'Aktivno državljanstvo' },
  { code: 'ZASVOJENOSTI', label: 'Zasvojenosti' },
  { code: 'TRAJNOSTNI_RAZVOJ', label: 'Trajnostni razvoj' },
  { code: 'DUSEVNO_ZDRAVJE', label: 'Duševno zdravje' },
  { code: 'ZDRAV_ZIVLJENJSKI_SLOG', label: 'Zdrav življenjski slog' },
  { code: 'ETIKA_DRUZBA', label: 'Etika in družbena odgovornost' },
] as const;

export const REGIONS = [
  { code: 'GORENJSKA', label: 'Gorenjska' },
  { code: 'DOLENJSKA', label: 'Dolenjska' },
  { code: 'STAJERSKA', label: 'Štajerska' },
  { code: 'PRIMORSKA', label: 'Primorska' },
  { code: 'NOTRANJSKA', label: 'Notranjska' },
  { code: 'KOROSKA', label: 'Koroška' },
  { code: 'PREKMURJE', label: 'Prekmurje' },
  { code: 'BELA_KRAJINA', label: 'Bela krajina' },
] as const;

// Filter Types
export interface WorkshopFilters {
  q?: string;
  region?: string;
  category?: string;
  activity_type?: string[];
  features?: string[];
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  sort?: SortOption;
  page?: number;
}

export type SortOption =
  | 'best_rating'
  | 'alphabetical'
  | 'most_viewed'
  | 'verified'
  | 'price_asc'
  | 'most_rated';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'best_rating', label: 'Najboljša ocena' },
  { value: 'alphabetical', label: 'Po abecedi' },
  { value: 'most_viewed', label: 'Največkrat ogledano' },
  { value: 'verified', label: 'Verificirano' },
  { value: 'price_asc', label: 'Po ceni (od najnižje do najvišje)' },
  { value: 'most_rated', label: 'Oglasi z največ ocenami' },
];

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Contact Form
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// View Mode
export type ViewMode = 'grid' | 'list';

// Auth & User Types
export interface UserProfile {
  id: number;
  email: string;
  username: string;
  role: 'SCHOOL' | 'PROVIDER' | 'ADMIN';
  is_email_verified: boolean;
  date_joined: string;
  school_profile?: SchoolProfile;
  provider_profile?: ProviderProfile;
  subscription?: ProviderSubscription;
}

export interface SchoolProfile {
  id: number;
  organization_name: string;
  profile_picture?: string;
  about_us?: string;
  city?: string;
  postal_code?: string;
  phone_number?: string;
  website_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  skype_username?: string;
  whatsapp_number?: string;
}

export interface ProviderProfile {
  id: number;
  organization_name: string;
  profile_picture?: string;
  about_us?: string;
  description?: string;
  website?: string;
  website_url?: string;
  city?: string;
  postal_code?: string;
  phone_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  skype_username?: string;
  whatsapp_number?: string;
  is_verified: boolean;
}

export interface ProviderSubscription {
  id: number;
  package_name: string;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterSchoolData {
  organization_name: string;
  email: string;
  password: string;
  password_confirm: string;
  accepted_terms: boolean;
  accepted_privacy: boolean;
}

export interface RegisterProviderData {
  organization_name: string;
  email: string;
  password: string;
  password_confirm: string;
  accepted_terms: boolean;
  accepted_privacy: boolean;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

