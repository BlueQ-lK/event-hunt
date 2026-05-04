export interface EventForm {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location: {
    name: string;
    address: string;
    city: string; 
  };
  category?: "tech" | "music" | "sports" | "education" | "business" | "art" | "health" | "food" | "travel" | "other";
  bannerImage?: File | string;
  brochure?: File | string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}
