export interface FestivalHub {
  id: string;
  name: string;
  type: 'Temple' | 'Committee' | 'Company' | 'Individual';
  visibility: 'Public' | 'Private';
  location: string;
  description: string;
  imageUrl: string;
}

export interface EventSchedule {
  time: string;
  activity: string;
}

export interface Event {
  id: string;
  hubId: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  category: 'Village Festival' | 'Concert' | 'Tradition' | 'Public Gathering' | 'Other';
  description: string;
  imageUrl: string;
  brochureUrl?: string;
  schedule: EventSchedule[];
}

export const hubs: FestivalHub[] = [
  {
    id: 'hub-1',
    name: 'Sri Venkateshwara Swamy Temple',
    type: 'Temple',
    visibility: 'Public',
    location: 'Bangalore, Karnataka',
    description: 'A historic temple known for its annual Brahmostavam and cultural heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1590766948512-48175d13f44f?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'hub-2',
    name: 'Navratri Utsav Committee',
    type: 'Committee',
    visibility: 'Public',
    location: 'Pune, Maharashtra',
    description: 'Organizing the largest Dandiya and Garba events in the region for over 20 years.',
    imageUrl: 'https://images.unsplash.com/photo-1566733971257-81cbf301479d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'hub-3',
    name: 'Echoes Entertainment',
    type: 'Company',
    visibility: 'Private',
    location: 'Mumbai, Maharashtra',
    description: 'Premium event management specializing in music concerts and international tours.',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
  },
];

export const events: Event[] = [
  {
    id: 'event-1',
    hubId: 'hub-1',
    title: 'Annual Brahmostavam 2026',
    startDate: '2026-05-15',
    endDate: '2026-05-25',
    location: 'Temple Grounds, Bangalore',
    category: 'Village Festival',
    description: 'A 10-day celebration featuring grand processions, traditional music, and community feasts.',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800',
    schedule: [
      { time: '06:00 AM', activity: 'Suprabhatam' },
      { time: '09:00 AM', activity: 'Kalyanotsavam' },
      { time: '06:00 PM', activity: 'Rathotsavam (Chariot Procession)' },
    ],
  },
  {
    id: 'event-2',
    hubId: 'hub-2',
    title: 'Mega Dandiya Night',
    startDate: '2026-10-12',
    endDate: '2026-10-21',
    location: 'Police Grounds, Pune',
    category: 'Tradition',
    description: 'Join thousands of enthusiasts for a night of dance, music, and vibrant colors.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253344-a8130a218a10?auto=format&fit=crop&q=80&w=800',
    schedule: [
      { time: '07:00 PM', activity: 'Gates Open' },
      { time: '08:30 PM', activity: 'Maha Aarti' },
      { time: '09:00 PM', activity: 'Dandiya Commences' },
    ],
  },
  {
    id: 'event-3',
    hubId: 'hub-3',
    title: 'Sunbeat Music Festival',
    startDate: '2026-12-20',
    endDate: '2026-12-22',
    location: 'Goa Coastline',
    category: 'Concert',
    description: 'Three days of non-stop music featuring global artists and breathtaking views.',
    imageUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800',
    schedule: [
      { time: '04:00 PM', activity: 'Sunset Sets' },
      { time: '08:00 PM', activity: 'Main Stage Performance' },
      { time: '11:00 PM', activity: 'After Hours' },
    ],
  },
];
