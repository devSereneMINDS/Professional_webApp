'use client';

import * as React from 'react';
import { 
  Card, CardActions, CardOverflow, Divider, FormControl, FormLabel, 
  Stack, Typography, Box, Button, IconButton, Select, Option, 
  useTheme, useColorScheme
} from '@mui/joy';
import DeleteIcon from '@mui/icons-material/Delete';
import { TimePicker, ConfigProvider } from 'antd';
import type { TimePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { AvailabilityDay } from './type';
import { theme as antdTheme } from 'antd';

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
  const { mode } = useColorScheme();
  const muiTheme = useTheme();

  const handleAddDay = () => {
    setAvailability([...availability, { day: '', times: ['09:00-17:00'] }]);
  };

  const handleDayChange = (index: number, value: string | null) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].day = value || '';
    setAvailability(updatedAvailability);
  };

  const handleStartTimeChange = (dayIndex: number, time: Dayjs | null) => {
    const updatedAvailability = [...availability];
    const currentTimeRange = (updatedAvailability[dayIndex].times && updatedAvailability[dayIndex].times[0]) || '09:00-17:00';
    const [, endTime] = currentTimeRange.split('-');
    const newStartTime = time?.format('HH:mm') || '09:00';
    if (!updatedAvailability[dayIndex].times) {
      updatedAvailability[dayIndex].times = [];
    }
    updatedAvailability[dayIndex].times[0] = `${newStartTime}-${endTime}`;
    setAvailability(updatedAvailability);
  };

  const handleEndTimeChange = (dayIndex: number, time: Dayjs | null) => {
    const updatedAvailability = [...availability];
    const currentTimeRange = updatedAvailability[dayIndex].times?.[0] || '09:00-17:00';
    const [startTime] = currentTimeRange.split('-');
    const newEndTime = time?.format('HH:mm') || '17:00';
    if (!updatedAvailability[dayIndex].times) {
      updatedAvailability[dayIndex].times = [];
    }
    updatedAvailability[dayIndex].times[0] = `${startTime}-${newEndTime}`;
    setAvailability(updatedAvailability);
  };

  const handleRemoveDay = (dayIndex: number) => {
    const updatedAvailability = availability.filter((_, i) => i !== dayIndex);
    setAvailability(updatedAvailability);
  };

  const parseTimeString = (timeString: string | undefined): Dayjs | null => {
    if (!timeString) return null;
    return dayjs(timeString, 'HH:mm');
  };

  const getTimeFromRange = (timeRange: string, isStart: boolean): Dayjs | null => {
    if (!timeRange) return parseTimeString('09:00');
    const [start, end] = timeRange.split('-');
    const timeString = isStart ? start : end;
    return parseTimeString(timeString);
  };

  // Custom TimePicker component with Joy UI styling
  const JoyTimePicker = (props: TimePickerProps) => (
    <ConfigProvider
      theme={{
        algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: muiTheme.palette.primary[500],
          colorBgContainer: muiTheme.palette.background.surface,
          colorText: muiTheme.palette.text.primary,
          colorBorder: muiTheme.palette.neutral.outlinedBorder,
          colorBgElevated: muiTheme.palette.background.level1,
          colorTextPlaceholder: muiTheme.palette.text.tertiary,
          controlHeight: 40,
          borderRadius: Number(muiTheme.radius.sm) || 6,
          fontFamily: muiTheme.fontFamily.body,
        },
        // No 'TimePicker' key here, as it's not supported by ComponentsConfig
      }}
    >
      <TimePicker
        {...props}
        style={{
          width: '100%',
          backgroundColor: muiTheme.palette.background.surface,
          ...props.style
        }}
        popupStyle={{
          zIndex: muiTheme.zIndex.modal,
          backgroundColor: muiTheme.palette.background.level1,
        }}
      />
    </ConfigProvider>
  );

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">Availability</Typography>
        <Typography level="body-sm">
          Set your weekly availability for appointments
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
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Start Time</FormLabel>
                <JoyTimePicker
                  value={getTimeFromRange(day.times?.[0] ?? '09:00-17:00', true)}
                  onChange={(time) => handleStartTimeChange(dayIndex, time)}
                  format="HH:mm"
                  minuteStep={15}
                  showNow={false}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>End Time</FormLabel>
                <JoyTimePicker
                  value={getTimeFromRange(day.times?.[0] ?? '09:00-17:00', false)}
                  onChange={(time) => handleEndTimeChange(dayIndex, time)}
                  format="HH:mm"
                  minuteStep={15}
                  showNow={false}
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