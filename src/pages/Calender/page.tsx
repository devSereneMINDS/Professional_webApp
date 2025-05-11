/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import VideoCallRoundedIcon from '@mui/icons-material/VideoCallRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';

import Sidebar from '../../components/Slidebar';
import Header from '../../components/Header';
import axios from 'axios';

interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  attendees?: Array<{ email: string }>;
  conferenceData?: {
    createRequest?: {
      requestId: string;
      conferenceSolutionKey: { type: string };
    };
    entryPoints?: Array<{
      entryPointType: string;
      uri: string;
    }>;
  };
  hangoutLink?: string;
}

export default function JoyOrderDashboardTemplate() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [guests, setGuests] = React.useState('');
  const [selectedEvent, setSelectedEvent] = React.useState<GoogleCalendarEvent | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const professionalToken = localStorage.getItem("googleAccessToken");

  React.useEffect(() => {
    if (professionalToken) {
      fetchGoogleCalendarEvents();
    }
  }, [professionalToken]);

  const fetchGoogleCalendarEvents = async () => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${professionalToken}`,
          },
          params: {
            timeMin: new Date().toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
          },
        }
      );

      const formattedEvents = response.data.items.map((event: GoogleCalendarEvent) => {
        const startDate = event.start.dateTime || event.start.date;
        const endDate = event.end.dateTime || event.end.date;
        
        return {
          id: event.id,
          title: event.summary || 'No Title',
          start: startDate,
          end: endDate,
          extendedProps: {
            description: event.description,
            attendees: event.attendees,
            hangoutLink: event.hangoutLink || 
              event.conferenceData?.entryPoints?.find(ep => ep.entryPointType === 'video')?.uri,
          },
        };
      });

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
    }
  };

  const handleAddEvent = async () => {
    if (!title || !date || !time) return;
    if (!professionalToken) {
      console.error('No authentication token found');
      return;
    }

    const eventDateTime = new Date(`${date}T${time}:00`).toISOString();

    const event: GoogleCalendarEvent = {
      summary: title,
      description: description,
      start: {
        dateTime: eventDateTime,
      },
      end: {
        dateTime: new Date(new Date(eventDateTime).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
      },
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(2),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    if (guests) {
      event.attendees = guests.split(',').map(email => ({ email: email.trim() }));
    }

    try {
      const response = await axios.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
        event,
        {
          headers: {
            Authorization: `Bearer ${professionalToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newEvent = {
        id: response.data.id,
        title: response.data.summary,
        start: response.data.start.dateTime || response.data.start.date,
        end: response.data.end.dateTime || response.data.end.date,
        extendedProps: {
          description: response.data.description,
          attendees: response.data.attendees,
          hangoutLink: response.data.hangoutLink || 
            response.data.conferenceData?.entryPoints?.find((ep: { entryPointType: string; uri: string }) => ep.entryPointType === 'video')?.uri,
        },
      };

      setEvents(prev => [...prev, newEvent]);
      setTitle('');
      setDate('');
      setTime('');
      setDescription('');
      setGuests('');
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      summary: event.title,
      description: event.extendedProps.description,
      start: { 
        dateTime: event.start?.toISOString(),
        date: event.start?.toISOString().split('T')[0]
      },
      end: { 
        dateTime: event.end?.toISOString(),
        date: event.end?.toISOString().split('T')[0]
      },
      attendees: event.extendedProps.attendees,
      hangoutLink: event.extendedProps.hangoutLink,
    });
    setOpenModal(true);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setDate(selectInfo.startStr.split('T')[0]);
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            minHeight: '100vh',
            overflow: 'hidden',
          }}
        >
          {/* Breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="#"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="#"
                sx={{ fontSize: 12, fontWeight: 500 }}
              >
                Dashboard
              </Link>
              <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
                Calendar
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Heading */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography level="h2" component="h1">
              Upcoming Events
            </Typography>
            {!professionalToken && (
              <Typography color="danger" level="body-sm">
                Please authenticate with Google to access calendar features
              </Typography>
            )}
          </Box>

          {/* Add Event Form */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap', 
            mt: 3,
            '& > *': { flex: '1 1 200px' }
          }}>
            <Input
              placeholder="Event Title"
              value={title}
              size="sm"
              onChange={(e) => setTitle(e.target.value)}
              disabled={!professionalToken}
            />
            <Input
              type="date"
              value={date}
              size="sm"
              onChange={(e) => setDate(e.target.value)}
              disabled={!professionalToken}
            />
            <Input
              type="time"
              value={time}
              size="sm"
              onChange={(e) => setTime(e.target.value)}
              disabled={!professionalToken}
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              size="sm"
              onChange={(e) => setDescription(e.target.value)}
              disabled={!professionalToken}
            />
            <Input
              placeholder="Guests (comma separated emails)"
              value={guests}
              size="sm"
              onChange={(e) => setGuests(e.target.value)}
              startDecorator={<PersonAddRoundedIcon />}
              disabled={!professionalToken}
            />
            <Button 
              onClick={handleAddEvent} 
              disabled={!professionalToken || !title || !date || !time}
              sx={{ flex: '0 1 auto',
                background: 'linear-gradient(rgba(2, 122, 242, 0.8), rgb(2, 107, 212))',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'linear-gradient(rgba(2, 122, 242, 1), rgb(2, 94, 186))',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            },
            '&:active': {
              background: 'linear-gradient(rgba(1, 102, 202, 1), rgb(1, 82, 162))'
            }
               }}
            >
              Add Event
            </Button>
            
          </Box>

          {/* FullCalendar */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            mt: 3
          }}>
            <Box sx={{ 
              flex: 1,
              minHeight: 0,
              overflow: 'auto'
            }}>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
                contentHeight="auto"
                eventClick={handleEventClick}
                select={handleDateSelect}
                selectable={true}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek,dayGridDay'
                }}
              />
            </Box>
          </Box>

          {/* Event Details Modal */}
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <ModalDialog size="lg">
              <ModalClose />
              <Typography level="h4" component="h2" mb={2}>
                {selectedEvent?.summary}
              </Typography>
              
              <List sx={{ gap: 1 }}>
                {selectedEvent?.description && (
                  <ListItem>
                    <DescriptionRoundedIcon sx={{ mr: 1 }} />
                    <ListItemContent>
                      <Typography level="body-sm">Description</Typography>
                      <Typography>{selectedEvent.description}</Typography>
                    </ListItemContent>
                  </ListItem>
                )}
                
                <ListItem>
                  <ScheduleRoundedIcon sx={{ mr: 1 }} />
                  <ListItemContent>
                    <Typography level="body-sm">Date & Time</Typography>
                    <Typography>
                      {selectedEvent?.start?.dateTime && new Date(selectedEvent.start.dateTime).toLocaleString()}
                      {selectedEvent?.end?.dateTime && 
                        ` - ${new Date(selectedEvent.end.dateTime).toLocaleTimeString()}`}
                    </Typography>
                  </ListItemContent>
                </ListItem>
                
                {(selectedEvent?.hangoutLink) && (
                  <ListItem>
                    <VideoCallRoundedIcon sx={{ mr: 1 }} />
                    <ListItemContent>
                      <Typography level="body-sm">Meeting Link</Typography>
                      <Link href={selectedEvent.hangoutLink} target="_blank">
                        Join Google Meet
                      </Link>
                    </ListItemContent>
                  </ListItem>
                )}
                
                {selectedEvent?.attendees?.length ? (
                  <ListItem>
                    <PersonAddRoundedIcon sx={{ mr: 1 }} />
                    <ListItemContent>
                      <Typography level="body-sm">Attendees</Typography>
                      <Typography>
                        {selectedEvent.attendees.map(a => a.email).join(', ')}
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                ) : null}
              </List>
              
              {selectedEvent?.hangoutLink && (
                <Box mt={2}>
                  <Button 
                    component="a" 
                    href={selectedEvent.hangoutLink} 
                    target="_blank"
                    startDecorator={<VideoCallRoundedIcon />}
                    fullWidth
                  >
                    Join Meeting
                  </Button>
                </Box>
              )}
            </ModalDialog>
          </Modal>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}