'use client';

import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Skeleton from '@mui/joy/Skeleton';
import { useTheme } from '@mui/joy/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Textarea } from '@mui/joy';
import { DatePicker, TimePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import Snackbar from '@mui/joy/Snackbar';
import { keyframes } from '@mui/system';

interface AppointmentCardProps {
  id: number;
  name?: string;
  photoUrl?: string;
  date?: string;
  time?: string;
  duration?: string;
  contact?: string;
  message?: string;
  meetLink?: string;
  isUpcoming?: boolean;
  isLoading?: boolean;
  professional?: string;
}

// Toastbar component
const inAnimation = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const outAnimation = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

interface ToastbarProps {
  open: boolean;
  onClose: () => void;
  prompt: string;
  success?: boolean;
  duration?: number;
}

const Toastbar: React.FC<ToastbarProps> = ({
  open,
  onClose,
  prompt,
  success = false,
  duration = 5000,
}) => {
  const animationDuration = 300;

  return (
    <Snackbar
      variant={success ? 'solid' : 'soft'}
      color={success ? 'success' : 'danger'}
      open={open}
      onClose={onClose}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      animationDuration={animationDuration}
      sx={[
        {
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
        },
        open && {
          animation: `${inAnimation} ${animationDuration}ms forwards`,
        },
        !open && {
          animation: `${outAnimation} ${animationDuration}ms forwards`,
        },
      ]}
      startDecorator={success ? <PlaylistAddCheckCircleRoundedIcon /> : <ErrorOutlineRoundedIcon />}
      endDecorator={
        <Button
          onClick={onClose}
          size="sm"
          variant="soft"
          color={success ? 'success' : 'danger'}
          sx={{ mr: -1, mt: -1 }}
        >
          Dismiss
        </Button>
      }
    >
      {prompt}
    </Snackbar>
  );
};

export default function AppointmentCard({
  id = 0,
  name = 'N/A',
  photoUrl,
  date = 'MM/DD/YYYY',
  time = '00:00:00 PM',
  duration = '00:00:00',
  contact = 'N/A',
  message = 'No message',
  meetLink,
  isUpcoming = true,
  isLoading = false,
  professional = 'Professional Name',
}: AppointmentCardProps) {
  const [open, setOpen] = React.useState(false);
  const [openMessage, setOpenMessage] = React.useState(false);
  const [openReschedule, setOpenReschedule] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<Dayjs | null>(null);
  const [isRescheduling, setIsRescheduling] = React.useState(false);
  const [clientMessage, setClientMessage] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [toastSuccess, setToastSuccess] = React.useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fixed duration parsing - now correctly handles HH:MM:SS format
const parseDuration = (durationString: string) => {
  if (!durationString) return '0 minutes';
  
  const parts = durationString.split(':');
  if (parts.length !== 3) return '0 minutes';
  
  const days = parseInt(parts[0]) || 0;
  const hours = parseInt(parts[1]) || 0;
  const minutes = parseInt(parts[2]) || 0;
  
  // Convert everything to minutes
  const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
  
  // Format the output based on the total duration
  if (totalMinutes >= 1440) { // More than 1 day
    const totalDays = Math.floor(totalMinutes / 1440);
    const remainingMinutes = totalMinutes % 1440;
    const remainingHours = Math.floor(remainingMinutes / 60);
    const finalMinutes = remainingMinutes % 60;
    
    let result = `${totalDays} day${totalDays !== 1 ? 's' : ''}`;
    if (remainingHours > 0) {
      result += ` ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    }
    if (finalMinutes > 0) {
      result += ` ${finalMinutes} minute${finalMinutes !== 1 ? 's' : ''}`;
    }
    return result;
  } else if (totalMinutes >= 60) { // More than 1 hour
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    let result = `${totalHours} hour${totalHours !== 1 ? 's' : ''}`;
    if (remainingMinutes > 0) {
      result += ` ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
    return result;
  } else { // Less than 1 hour
    return `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}`;
  }
};

  const formattedDuration = parseDuration(duration);

  const showToast = (message: string, success: boolean) => {
    setToastMessage(message);
    setToastSuccess(success);
    setToastOpen(true);
  };

  const openClientMessage = () => {
    setClientMessage('');
    setOpenMessage(true);
  };

  const handleSendMessage = async () => {
    if (!clientMessage.trim()) {
      showToast("Message cannot be empty", false);
      return;
    }

    if (!API_BASE_URL) {
      showToast("API configuration error. Please try again later.", false);
      console.error("API_BASE_URL is missing");
      return;
    }

    // Validate professional name
    if (!professional || professional.trim() === '' || professional === 'Professional Name') {
      showToast("Professional name is invalid or not provided.", false);
      console.error("Invalid professional name:", professional);
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/whatsapp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignName: "client_professional_message02",
          destination: contact,
          userName: "Serene MINDS",
          templateParams: [name, professional, clientMessage],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send message");
      }

      showToast("Message sent successfully!", true);
      setOpenMessage(false);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      showToast(`Error: ${errorMessage}`, false);
    } finally {
      setIsSending(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      showToast('Please select both date and time', false);
      return;
    }

    try {
      setIsRescheduling(true);
      
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const formattedTime = selectedTime.format('HH:mm');
      
      await onReschedule(id, formattedDate, formattedTime);
      
      setOpenReschedule(false);
      setOpen(false);
      
      showToast('Appointment rescheduled successfully!', true);
    } catch (error) {
      console.error('Reschedule error:', error);
      showToast('Failed to reschedule appointment. Please try again.', false);
    } finally {
      setIsRescheduling(false);
    }
  };

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ 
        minWidth: 300, 
        maxWidth: 300, 
        p: 2,
        [theme.breakpoints.down('sm')]: {
          minWidth: '100%',
          maxWidth: '100%'
        }
      }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
      </Card>
    );
  }

  return (
    <>
      <Toastbar 
        open={toastOpen} 
        onClose={() => setToastOpen(false)} 
        prompt={toastMessage} 
        success={toastSuccess} 
      />

      <Card variant="outlined" sx={{ 
        minWidth: 350, 
        maxWidth: 300,
        p: 2,
        [theme.breakpoints.down('sm')]: {
          minWidth: '100%',
          maxWidth: '100%'
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={photoUrl} alt={name} />
            <Typography level="title-md" fontWeight="bold">{name}</Typography>
          </Box>
          <IconButton variant="plain" onClick={() => setOpen(true)}>
            <OpenInNewIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <IconButton variant="solid" onClick={openClientMessage} color="primary">
            <ChatBubbleOutlineIcon />
          </IconButton>
          {meetLink && (
            <IconButton
              variant="solid"
              color="primary"
              onClick={() => window.open(meetLink, '_blank')}
            >
              <VideocamIcon />
            </IconButton>
          )}
        </Box>

        <CardContent>
          <Stack spacing={1}>
            <DetailRow label="Date" value={date} />
            <DetailRow label="Time" value={time} />
            <DetailRow label="Duration" value={formattedDuration} />
            <DetailRow label="Contact" value={contact} />
          </Stack>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          variant="outlined"
          sx={{
            borderRadius: '16px',
            p: isMobile ? 2 : 3,
            width: isMobile ? '90%' : 'auto',
            maxWidth: isMobile ? '100%' : 750,
            maxHeight: '90vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 4
          }}
        >
          <ModalClose />

          {/* Left Side */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1,
            mb: isMobile ? 2 : 0
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar src={photoUrl} alt={name} />
              <Typography level="title-md" >{name}</Typography>
            </Box>
            <DetailRow label="Date" value={date} />
            <DetailRow label="Time" value={time} />
            <DetailRow label="Duration" value={formattedDuration} />
            <DetailRow label="Contact" value={contact} />

            {isUpcoming && (
              <Button
                variant="solid"
                color="success"
                onClick={() => {
                  setOpenReschedule(true);
                  if (date && time) {
                    try {
                      const [month, day, year] = date.split('/');
                      const [hours, minutes] = time.split(':');
                      const ampm = time.includes('PM') ? 'PM' : 'AM';
                      let hoursNum = parseInt(hours);
                      if (ampm === 'PM' && hoursNum < 12) hoursNum += 12;
                      if (ampm === 'AM' && hoursNum === 12) hoursNum = 0;
                      
                      setSelectedDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
                      setSelectedTime(dayjs().hour(hoursNum).minute(parseInt(minutes.substring(0, 2))));
                    } catch (e) {
                      console.error('Error parsing date/time:', e);
                    }
                  }
                }}
                sx={{ mt: 3 }}
                fullWidth={isMobile}
              >
                Reschedule Appointment
              </Button>
            )}
          </Box>

          {/* Right Side */}
          <Box sx={{ flex: 1 }}>
            <Typography level="title-md" mb={1}>
              Message from {name}
            </Typography>
            <Typography level="body-md" sx={{ whiteSpace: 'pre-line' }}>
              {message}
            </Typography>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Reschedule Modal */}
      <Modal open={openReschedule} onClose={() => setOpenReschedule(false)}>
        <ModalDialog
          variant="outlined"
          sx={{
            borderRadius: 'md',
            p: 3,
            width: isMobile ? '90%' : '400px',
            maxWidth: '100%',
            '& .ant-picker-panel-container': {
              zIndex: theme.zIndex.modal + 1,
            },
            '& .ant-picker-dropdown': {
              zIndex: theme.zIndex.modal + 1,
            }
          }}
        >
          <ModalClose />
          <Typography level="h4" mb={2}>Reschedule Appointment</Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography level="body-sm" mb={1}>Select Date</Typography>
              <DatePicker
                onChange={(date) => setSelectedDate(date ? date.toDate() : null)}
                disabledDate={(date) => date ? date.isBefore(dayjs(), 'day') : false}
                value={selectedDate ? dayjs(selectedDate) : dayjs()}
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              />
            </Box>

            <Box>
              <Typography level="body-sm" mb={1}>Select Time</Typography>
              <TimePicker
                value={selectedTime}
                onChange={(time) => setSelectedTime(time)}
                format="HH:mm"
                minuteStep={15}
                showNow={false}
                style={{ width: '100%' }}
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              />
            </Box>

            <Button
              variant="solid"
              color="primary"
              onClick={handleReschedule}
              loading={isRescheduling}
              sx={{ mt: 2 }}
              fullWidth
            >
              Confirm New Time
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Message Modal */}
      <Modal open={openMessage} onClose={() => setOpenMessage(false)}>
        <ModalDialog
          size="lg"
          sx={{
            minWidth: { xs: '90%', sm: '60%', md: '50%' },
            maxWidth: '800px',
            p: 3,
          }}
        >
          <ModalClose />
          <Typography level="h4" fontWeight="lg" mb={2}>
            Send WhatsApp message to {name}
          </Typography>
          
          <Textarea
            minRows={3}
            maxRows={6}
            placeholder="Enter your message here..."
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button
              size="md"
              variant="solid"
              color="primary"
              sx={{ borderRadius: 'xl' }}
              onClick={handleSendMessage}
              loading={isSending}
            >
              Send via WhatsApp
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography level="body-sm" color="neutral">{label}</Typography>
      <Typography level="body-sm" fontWeight="bold">{value}</Typography>
    </Box>
  );
}

const onReschedule = async (appointmentID: number, newDate: string, newTime: string) => {
  try {
    if (!newDate || !newTime) {
      throw new Error("Date and time are required for rescheduling.");
    }
    const appointmentTime = `${newDate}T${newTime}:00`;
    console.log("Reschedule data:", { appointmentID, appointmentTime });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(
      `${API_BASE_URL}/appointment/update/${appointmentID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_time: appointmentTime,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to reschedule the appointment: ${errorText}`);
    }

    const result = await response.json();
    console.log("Appointment rescheduled:", result);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error rescheduling appointment:", error.message);
    } else {
      console.error("Error rescheduling appointment:", error);
    }
    throw error;
  }
};