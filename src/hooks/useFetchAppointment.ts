import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAppointments } from "../store/slices/appointmentSlice";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const PROFESSIONAL_ID = 1; // Hardcoded professional ID
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
  status?: string; // Added status property
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
    if (!enrichedAppointment || !userToken) {
      throw new Error("Missing required parameters: appointment details or user token.");
    }

    if (!enrichedAppointment.appointment_time) {
      throw new Error("Appointment time is missing.");
    }
    if (!enrichedAppointment.client || !enrichedAppointment.client.email) {
      throw new Error("Client details or email is missing.");
    }

    // ✅ Convert appointment_time to Date object
    const appointmentDateTime = new Date(enrichedAppointment.appointment_time);
    if (isNaN(appointmentDateTime.getTime())) {
      throw new Error(`Invalid appointment_time format: ${enrichedAppointment.appointment_time}`);
    }

    // ✅ Extract Date & Time parts in "YYYY-MM-DDTHH:MM:SS" format
    const formattedDateTime = appointmentDateTime.toISOString(); // Full ISO format

    // ✅ Extract the duration (convert to milliseconds)
    const durationSeconds = enrichedAppointment.duration
      ? parseInt(enrichedAppointment.duration.split(":").pop()!, 10) // Get last part (seconds)
      : 3600; // Default to 1 hour if missing

    // ✅ Compute End Time
    const endDateTime = new Date(appointmentDateTime.getTime() + durationSeconds * 1000).toISOString();

    const event: GoogleCalendarEvent = {
      summary: `Meeting with ${enrichedAppointment.client.name || "Client"}`,
      start: {
        dateTime: formattedDateTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      attendees: [{ email: enrichedAppointment.client.email }],
    };

    // ✅ Make API request to Google Calendar
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

    return response.data as { hangoutLink?: string } | null;
  } catch (error: unknown) {
    console.error("Error creating Google Calendar event:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("Google API Response:", error.response.data);

      if (error.response.status === 401) {
        throw new Error("Unauthorized: Invalid or expired access token.");
      } else if (error.response.status === 403) {
        throw new Error("Permission denied: Ensure calendar permissions are granted.");
      } else if (error.response.status === 400) {
        throw new Error(`Bad request: ${error.response.data.error.message}`);
      } else if (error.response.status >= 500) {
        throw new Error("Google API service is temporarily unavailable. Try again later.");
      }
    } else if (axios.isAxiosError(error) && error.request) {
      console.error("Network Error:", error.request);
      throw new Error("Network error: Unable to reach Google Calendar API. Check internet connection.");
    } else {
      if (error instanceof Error) {
        console.error(`Unexpected error: ${error.message}`);
      } else {
        console.error("Unexpected error occurred.");
      }
    }
    return null; // Ensure a return value in case of an error
  }
};



const useFetchAppointments = () => {
  const dispatch = useDispatch();
  const professionalId = useSelector((state) => state.professional?.data?.id);
  const professionalToken = useSelector((state) => state.professional?.professionalToken);

  useEffect(() => {
    if (!professionalId) return;

    const APPOINTMENT_API_URL = `${API_BASE_URL}/appointment/professional/${professionalId}`;

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(APPOINTMENT_API_URL);
        const fetchedData = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const categorizedData: {
          upcoming: EnrichedAppointment[];
          completed: EnrichedAppointment[];
          cancelled: EnrichedAppointment[];
        } = {
          upcoming: [],
          completed: [],
          cancelled: [],
        };

        // Process appointments sequentially to avoid race conditions
        for (const appointment of fetchedData) {
          try {
            const clientResponse = await axios.get(
              `${CLIENT_API_URL}/${appointment.client_id}`
            );
            const clientDetails = clientResponse.data;

            const appointmentDate = new Date(appointment.appointment_time);
            const enrichedAppointment = {
              ...appointment,
              client: clientDetails,
            };

            // Skip processing if appointment is cancelled
            if (appointment.status.toLowerCase() === "cancelled") {
              categorizedData.cancelled.push(enrichedAppointment);
              continue;
            }

            // Handle upcoming appointments
            if (appointmentDate >= today) {
              // Only create meet link if it doesn't exist and we have a token
              if (!enrichedAppointment.meet_link && professionalToken) {
                try {
                  console.log("Creating Google Calendar event for:", enrichedAppointment);
                  const googleEvent = await createGoogleCalendarEvent(enrichedAppointment, professionalToken);
                  
                  if (googleEvent?.hangoutLink) {
                    // Update the appointment with the meet link
                    const updateResponse = await axios.put(
                      `${API_BASE_URL}/appointment/update/${enrichedAppointment.id}`,
                      { meet_link: googleEvent.hangoutLink }
                    );

                    if (updateResponse.status === 200) {
                      enrichedAppointment.meet_link = googleEvent.hangoutLink;
                      console.log("Meet Link Generated Successfully!!");
                    }
                  }
                } catch (error) {
                  console.error("Failed to create Google Calendar event:", error);
                  // Continue with the appointment even if meet link creation failed
                }
              }

              categorizedData.upcoming.push({
                ...enrichedAppointment,
                status: "Upcoming",
              });
            } 
            // Handle past appointments
            else {
              categorizedData.completed.push({
                ...enrichedAppointment,
                status: "Completed",
              });
            }
          } catch (error) {
            console.error("Error processing appointment:", appointment.id, error);
            // Push the appointment without processing if there's an error
            categorizedData.upcoming.push(appointment);
          }
        }
        console.log("Categorized Data:", categorizedData);
        dispatch(setAppointments(categorizedData));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [dispatch, professionalId, professionalToken]);
};

export default useFetchAppointments;
