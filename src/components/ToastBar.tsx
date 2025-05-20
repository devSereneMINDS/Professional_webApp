import * as React from 'react';
import Snackbar from '@mui/joy/Snackbar';
import Button from '@mui/joy/Button';
import { keyframes } from '@mui/system';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Animation keyframes
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
  neutral?: boolean;
  duration?: number;
}

const Toastbar: React.FC<ToastbarProps> = ({
  open,
  onClose,
  prompt,
  success = false,
  neutral = false,
  duration = 5000,
}) => {
  const animationDuration = 300;

  // Determine color and icon based on props
  const color = success ? 'success' : neutral ? 'neutral' : 'danger';
  const icon = success ? (
    <PlaylistAddCheckCircleRoundedIcon />
  ) : neutral ? (
    <InfoOutlinedIcon />
  ) : (
    <ErrorOutlineRoundedIcon />
  );

  return (
    <Snackbar
      variant={neutral ? 'soft' : 'solid'}
      color={color}
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
      startDecorator={icon}
      endDecorator={
        <Button
          onClick={onClose}
          size="sm"
          variant="soft"
          color={color}
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

export default Toastbar;