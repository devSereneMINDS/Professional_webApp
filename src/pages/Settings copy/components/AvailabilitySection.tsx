import * as React from 'react';
import { 
  Card, CardActions, CardOverflow, Divider, FormControl, FormLabel, 
  Input, Stack, Typography, Box, Button, IconButton, Select, Option 
} from '@mui/joy';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import { AvailabilityDay } from './type';

interface AvailabilitySectionProps {
  availability: AvailabilityDay[];
  setAvailability: React.Dispatch<React.SetStateAction<AvailabilityDay[]>>;
  isLoading: boolean;
  onSave: () => void;
}

export default function AvailabilitySection({ 
  availability, 
  setAvailability, 
  isLoading, 
  onSave 
}: AvailabilitySectionProps) {
  const handleAddDay = () => {
    setAvailability([...availability, { day: '', times: [''] }]);
  };

  const handleDayChange = (index: number, value: string | null) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].day = value || '';
    setAvailability(updatedAvailability);
  };

  const handleAvailabilityTimeChange = (dayIndex: number, timeIndex: number, value: string) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].times[timeIndex] = value;
    setAvailability(updatedAvailability);
  };

  const handleRemoveDay = (dayIndex: number) => {
    const updatedAvailability = availability.filter((_, i) => i !== dayIndex);
    setAvailability(updatedAvailability);
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">Availability</Typography>
        <Typography level="body-sm">
          Set your weekly availability for appointments (one time slot per day)
        </Typography>
      </Box>
      <Divider />
      <Stack spacing={3} sx={{ my: 2 }}>
        {availability.map((day, dayIndex) => (
          <div key={dayIndex}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Day</FormLabel>
                <Select
                  size="sm"
                  value={day.day}
                  onChange={(_, value) => handleDayChange(dayIndex, value)}
                >
                  <Option value="Monday">Monday</Option>
                  <Option value="Tuesday">Tuesday</Option>
                  <Option value="Wednesday">Wednesday</Option>
                  <Option value="Thursday">Thursday</Option>
                  <Option value="Friday">Friday</Option>
                  <Option value="Saturday">Saturday</Option>
                  <Option value="Sunday">Sunday</Option>
                </Select>
              </FormControl>
              {availability.length > 1 && (
                <IconButton
                  size="sm"
                  variant="soft"
                  color="danger"
                  onClick={() => handleRemoveDay(dayIndex)}
                  sx={{ mt: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
            <Stack spacing={1}>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Time Slot</FormLabel>
                <Input
                  size="sm"
                  value={day.times[0] || ''}
                  onChange={(e) => handleAvailabilityTimeChange(dayIndex, 0, e.target.value)}
                  placeholder="HH:MM-HH:MM"
                  startDecorator={<AccessTimeFilledRoundedIcon />}
                />
              </FormControl>
            </Stack>
            {dayIndex < availability.length - 1 && <Divider sx={{ my: 2 }} />}
          </div>
        ))}
        <Button
          variant="outlined"
          color="neutral"
          onClick={handleAddDay}
          sx={{ alignSelf: 'flex-start' }}
        >
          Add Another Day
        </Button>
      </Stack>
      <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
          <Button size="sm" variant="outlined" color="neutral">
            Cancel
          </Button>
          <Button 
            size="sm" 
            variant="solid"
            onClick={onSave}
            loading={isLoading}
            sx={{
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
            Save Availability
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}