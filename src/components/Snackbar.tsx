import Snackbar from '@mui/joy/Snackbar';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import { useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ConfirmationSnackbarProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}


export default function ConfirmationSnackbar({ open, onClose, onConfirm }: ConfirmationSnackbarProps) {
      const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Snackbar
      autoHideDuration={7000}
      variant="solid"
      color="primary"
      size="lg"
      invertedColors
      open={open}
      onClose={onClose}
      anchorOrigin={{  vertical: isMobile ? 'top' : 'bottom',
        horizontal: 'right' }}
      sx={(theme) => ({
        background: `linear-gradient(45deg, ${theme.palette.primary[600]} 30%, ${theme.palette.primary[500]} 90%})`,
        maxWidth: 360,
        zIndex: 10000
      })}
    >
        <IconButton
        size="sm"
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          color: 'white',
        }}
      >
        <CloseIcon />
        </IconButton>
      <div>
        <Typography level="title-lg">Hey, Wait!!</Typography>
        <Typography sx={{ mt: 1, mb: 2 }}>
          Finish setting up your profile to enhance your experience
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="solid" color="primary" onClick={onConfirm}>
            Sure thing!
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={onClose}
          >
            May be later
          </Button>
        </Stack>
      </div>
    </Snackbar>
  );
}