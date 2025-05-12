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

export interface CountryType {
  name: string | null;
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export interface EducationEntry {
  institute: string;
  degree: string;
  description: string;
}

export interface FormData {
  full_name: string;
  email: string;
  phone: string;
  area_of_expertise: string;
  country: string | null;
  about_me: string;
  education: EducationEntry[];
  instagram: string;
  facebook: string;
}

// Add this to your existing types in types.ts
export interface AccountLinks {
  instagram: string;
  facebook: string;
}
// interface AccountsSectionProps {
//   formData: FormData;
//   setFormData: React.Dispatch<React.SetStateAction<FormData>>;
//   isLoading: boolean;
//   onSave: () => void;
// }
export interface FormData {
  // Add existing fields here
  instagram: string;
  facebook: string;
}