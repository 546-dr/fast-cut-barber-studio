export interface ServiceItem {
  id: string;
  name: string;
  category: 'corte' | 'barba' | 'color' | 'diseno' | 'ninos' | string;
  description: string;
  durationMinutes: number;
  samplePrice: number;
  image: string;
  badge?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Fade' | 'Clásico' | 'Barba' | 'Diseños' | 'Niños' | 'Tinturados' | string;
  image: string;
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  experience: string;
}

export interface StudioConfig {
  name: string;
  slogan: string;
  tagline: string;
  phoneWhatsapp: string;
  phoneDisplay: string;
  address: string;
  city: string;
  scheduleWeekday: string;
  scheduleSaturday: string;
  scheduleSunday: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  currencySymbol: string;
  googleMapsQuery: string;
  websiteUrl?: string;
}

export interface BookingState {
  serviceId: string;
  clientName: string;
  date: string;
  time: string;
  barberId: string;
  extraNotes: string;
}

export interface Testimonial {
  id: string;
  name: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  avatarText?: string;
  avatarUrl?: string;
}
