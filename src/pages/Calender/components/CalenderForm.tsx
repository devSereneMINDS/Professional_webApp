import * as React from 'react';
import { Button, Input, Box } from '@mui/joy';

interface CalendarFormProps {
  onAddEvent: (title: string, date: string) => void;
}

export const CalendarForm: React.FC<CalendarFormProps> = ({ onAddEvent }) => {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    onAddEvent(title, date);
    setTitle('');
    setDate('');
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}
    >
      <Input
        placeholder="Event Title"
        value={title}
        size="sm"
        onChange={(e) => setTitle(e.target.value)}
        sx={{ flex: 1, minWidth: '200px' }}
        required
      />
      <Input
        type="date"
        value={date}
        size="sm"
        onChange={(e) => setDate(e.target.value)}
        sx={{ flex: 1, minWidth: '200px' }}
        required
      />
      <Button type="submit">Add Event</Button>
    </Box>
  );
};