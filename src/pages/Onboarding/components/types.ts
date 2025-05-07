import { DatePickerProps } from '@mui/x-date-pickers/DatePicker';

export interface OnboardingFormProps {
  handleNext: () => void;
  handleBack?: () => void;
}

export interface BasicDetailsFormProps extends OnboardingFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  email: string;
  lastName: string;
  setLastName: (value: string) => void;
  dob: DatePickerProps<Date>['value'];
  setDob: (value: Date | null) => void;
  phone: string;
  handlePhoneChange: (value: string) => void;
  setPhone: (value: string) => void;
  avatar: string | null;
  setAvatar: (value: string | null) => void;
  domain: string;
  setDomain: (domain: string) => void;
}

export interface OtpVerificationFormProps extends OnboardingFormProps {
  phone: string;
  email: string;
}

export interface DocumentUploadFormProps extends OnboardingFormProps {
  document: File | null;
  setDocument: (file: File | null) => void;
}

export interface AvatarWithEditProps {
  src: string | null;
  onChange: (file: File) => void;
}

export const steps = [
  'Professional Details',
  'OTP Verification',
  'Document Upload',
  'Complete'
];