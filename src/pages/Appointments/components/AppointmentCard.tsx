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

interface AppointmentCardProps {
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
}

export default function AppointmentCard({
  name = 'N/A',
  photoUrl,
  date = 'MM/DD/YYYY',
  time = '00:00:00 PM',
  duration = '0 minutes',
  contact = 'N/A',
  message = 'No message',
  meetLink,
  isUpcoming = true,
  isLoading = false,
}: AppointmentCardProps) {
  const [open, setOpen] = React.useState(false);

  const formattedDuration = duration
    ? `${parseInt(duration.split(':')[1])} minutes`
    : '0 minutes';

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ minWidth: 300, maxWidth: 300, p: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
      </Card>
    );
  }

  return (
    <>
      <Card variant="outlined" sx={{ minWidth: 350, p: 2 }}>
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
          <IconButton variant="solid" color="primary">
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

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          variant="outlined"
          sx={{
            borderRadius: '16px',
            p: 3,
            minWidth: 700,
            maxWidth: 750,
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
          }}
        >
          <ModalClose />

          {/* Left Side */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar src={photoUrl} alt={name} />
              <Typography level="title-md" fontWeight="bold">{name}</Typography>
            </Box>
            <DetailRow label="Date" value={date} />
            <DetailRow label="Time" value={time} />
            <DetailRow label="Duration" value={formattedDuration} />
            <DetailRow label="Contact" value={contact} />

            {isUpcoming && (
              <Button
                variant="solid"
                color="success"
                onClick={() => setOpen(false)}
                sx={{ mt: 3 }}
              >
                Confirm Reschedule
              </Button>
            )}
          </Box>

          {/* Right Side */}
          <Box sx={{ flex: 1 }}>
            <Typography level="title-md" fontWeight="bold" mb={1}>
              Message from {name}
            </Typography>
            <Typography level="body-md" sx={{ whiteSpace: 'pre-line' }}>
              {message}
            </Typography>

          </Box>
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
