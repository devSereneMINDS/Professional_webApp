export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    extendedProps: {
      meetLink?: string;
      guests?: string[];
    };
  }
  
  export interface EventModalData {
    title: string;
    start: string;
    end: string;
    meetLink?: string;
    guests?: string[];
  }
  
  export interface CalendarApiEvent {
    id: string;
    summary: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
    conferenceData?: {
      entryPoints?: Array<{
        entryPointType: string;
        uri: string;
      }>;
    };
    attendees?: Array<{ email: string }>;
  }