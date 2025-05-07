import * as React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box } from '@mui/joy';

interface CalendarEvent {
  title: string;
  date: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  return (
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
        />
      </Box>
    </Box>
  );
};