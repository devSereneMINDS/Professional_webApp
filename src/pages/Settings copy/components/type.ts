// type.ts
export interface Service {
  name: string;
  description: string;
  duration: string;
  price: string;
  currency?: string;
}

export interface AvailabilityDay {
  day: string;
  times: string[];
}

export interface EducationEntry {
  institute: string;
  degree: string;
  description: string;
}

export interface FormData {
  photo_url: string; // Changed from optional to required
  full_name: string;
  email: string;
  phone: string;
  area_of_expertise: string; // Fixed typo (was expertise)
  country: string | null;
  city: string; // Changed from optional to required
  about_me: string;
  education: EducationEntry[];
  instagram_account: string;
  linkedin_account: string;
  languages: string[];
}

export interface ProfessionalData {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  area_of_expertise: string;
  country: string | null;
  about_me: string;
  city: string;
  education: EducationEntry[];
  services: {
    serviceTitle: string;
    serviceDescription: string;
    duration: number;
    price: number;
    currency: string;
  }[];
  availability: Record<string, string>;
  photo_url: string;
  instagram_account?: string;
  linkedin_account?: string;
  languages?: string[];
}

export interface ProfessionalState {
  data: ProfessionalData;
}
// Add this to your type.ts file
export interface AccountLinks {
  instagram_account: string;
  linkedin_account: string;
}