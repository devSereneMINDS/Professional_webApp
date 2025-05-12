import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAppointments } from "../store/slices/appointmentSlice";
import axios from "axios";
import { RootState } from "../store/store"; // Adjust the path to your store file

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLIENT_API_URL = `${API_BASE_URL}/clients2`;

interface EnrichedAppointment {
  id: number;
  appointment_time: string;
  duration?: string;
  client: {
    name?: string;
    email: string;
  };
  meet_link?: string | null;
  status?: string;
  [x: string]: string | number | boolean | null | undefined | object;
}

interface GoogleCalendarEvent {
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  conferenceData: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
  attendees: {
    email: string;
  }[];
}

const createGoogleCalendarEvent = async (
  enrichedAppointment: EnrichedAppointment,
  userToken: string
): Promise<{ hangoutLink?: string } | null> => {
  try {
    // Validate inputs
    if (!enrichedAppointment || !userToken) {
      throw new Error("Missing required parameters");
    }

    if (!enrichedAppointment.appointment_time) {
      throw new Error("Appointment time is missing");
    }

    if (!enrichedAppointment.client?.email) {
      throw new Error("Client email is missing");
    }

    // Parse and validate appointment time
    const appointmentDateTime = new Date(enrichedAppointment.appointment_time);
    if (isNaN(appointmentDateTime.getTime())) {
      throw new Error("Invalid appointment time format");
    }

    // Calculate end time (default to 1 hour if duration not provided)
    const durationMs = enrichedAppointment.duration
      ? parseDurationToMs(enrichedAppointment.duration)
      : 60 * 60 * 1000; // 1 hour in ms
    const endDateTime = new Date(appointmentDateTime.getTime() + durationMs);

    // Create the event payload
    const event: GoogleCalendarEvent = {
      summary: `Meeting with ${enrichedAppointment.client.name || "Client"}`,
      start: {
        dateTime: appointmentDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      attendees: [{ email: enrichedAppointment.client.email }],
    };

    // Make API request to Google Calendar
    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      event,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Verify the meet link was generated
    const hangoutLink = response.data.hangoutLink || 
      response.data.conferenceData?.entryPoints?.find(
        (ep: { entryPointType: string; uri?: string }) => ep.entryPointType === "video"
      )?.uri;

    if (!hangoutLink) {
      throw new Error("Google Meet link was not generated");
    }

    return { hangoutLink };
  } catch (error: unknown) {
    handleGoogleCalendarError(error);
    return null;
  }
};

// Helper function to parse duration string to milliseconds
const parseDurationToMs = (duration: string): number => {
  const parts = duration.split(':');
  if (parts.length !== 3) return 60 * 60 * 1000; // Default 1 hour
  
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  const seconds = parseInt(parts[2]) || 0;
  
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
};

// Improved error handling
const handleGoogleCalendarError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("Google API Error:", {
        status: error.response.status,
        data: error.response.data,
      });
      
      if (error.response.status === 401) {
        throw new Error("Authentication failed. Please re-authenticate.");
      } else if (error.response.status === 403) {
        throw new Error("Calendar permissions required.");
      }
    } else if (error.request) {
      console.error("Network Error:", error.request);
      throw new Error("Network connection failed.");
    }
  }
  
  console.error("Unexpected error:", error);
  throw new Error("Failed to create calendar event.");
};

const useFetchAppointments = () => {
  const dispatch = useDispatch();
  interface ProfessionalData {
  id?: string;
  full_name?: string;
  email?: string;
  photo_url?: string;
}

 const professional = useSelector((state: RootState) => state.professional as { data?: ProfessionalData });
 const professionalId = professional.data?.id
  console.log("Professional ID:", professionalId);
  const professionalToken = localStorage.getItem("googleAccessToken");
  useEffect(() => {
    if (!professionalId) return;

    const APPOINTMENT_API_URL = `${API_BASE_URL}/appointment/professional/${professionalId}`;

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(APPOINTMENT_API_URL);
        const fetchedData = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const categorizedData = {
          upcoming: [] as EnrichedAppointment[],
          completed: [] as EnrichedAppointment[],
          cancelled: [] as EnrichedAppointment[],
        };

        // Process appointments in parallel with Promise.all
        const processedAppointments = await Promise.all(
          fetchedData.map(async (appointment: EnrichedAppointment) => {
            try {
              // Skip if cancelled
              if (appointment.status?.toLowerCase() === "cancelled") {
                return { ...appointment, status: "Cancelled", category: "cancelled" };
              }

              // Get client details
              const clientResponse = await axios.get(`${CLIENT_API_URL}/${appointment.client_id}`);
              console.log("Client details fetched:", clientResponse.data);
              const clientDetails = clientResponse.data;

              const enrichedAppointment: EnrichedAppointment = {
                ...appointment,
                client: clientDetails,
                status: new Date(appointment.appointment_time) >= today 
                  ? "Upcoming" 
                  : "Completed",
              };

              // Only create meet link if:
              // 1. Appointment is upcoming
              // 2. No existing meet_link
              // 3. We have a valid token
              if (
                enrichedAppointment.status === "Upcoming" &&
                !enrichedAppointment.meet_link &&
                professionalToken
              ) {
                try {
                  console.log("Attempting to create meet link for appointment:", enrichedAppointment.id);
                  const googleEvent = await createGoogleCalendarEvent(enrichedAppointment, professionalToken);
                  
                  if (googleEvent?.hangoutLink) {
                    console.log("Meet link generated:", googleEvent.hangoutLink);
                    
                    // Update the backend with the new meet link
                    await axios.put(
                      `${API_BASE_URL}/appointment/update/${enrichedAppointment.id}`,
                      { meet_link: googleEvent.hangoutLink }
                    );
                    
                    return {
                      ...enrichedAppointment,
                      meet_link: googleEvent.hangoutLink,
                      category: "upcoming",
                    };
                  }
                } catch (error) {
                  console.error("Meet link generation failed for appointment:", enrichedAppointment.id, error);
                  // Continue with the existing appointment data
                }
              }

              return {
                ...enrichedAppointment,
                category: enrichedAppointment.status?.toLowerCase() || "unknown",
              };
            } catch (error) {
              console.error("Error processing appointment:", appointment.id, error);
              return {
                ...appointment,
                status: "Error",
                category: "upcoming", // default category
              };
            }
          })
        );

        // Categorize the processed appointments
        processedAppointments.forEach((appointment) => {
          if (appointment.category === "upcoming") {
            categorizedData.upcoming.push(appointment);
          } else if (appointment.category === "completed") {
            categorizedData.completed.push(appointment);
          } else if (appointment.category === "cancelled") {
            categorizedData.cancelled.push(appointment);
          }
        });

        console.log("Final categorized data:", categorizedData);
        dispatch(setAppointments(categorizedData));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [dispatch, professionalId, professionalToken]);
};

export default useFetchAppointments;