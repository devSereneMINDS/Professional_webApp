import { useState } from 'react';
import { Card, Typography, Box, Button } from '@mui/joy';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ToastBar from '../../../components/ToastBar';

interface StatCardProps {
  title: string;
  value: string | number;
  timePeriod: string;
  gradientColors: [string, string];
  barColor: string;
}

export const StatCard = ({ title, value, timePeriod, gradientColors, barColor }: StatCardProps) => {
  return (
    <Card variant="outlined" sx={{ gap: 0, p: 2 }}>
      <Typography level="title-md" variant="plain" sx={{ pb: 0.5 }}>{title}</Typography>
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography level="h3">{value}</Typography>
      </Box>
      <Typography level="body-xs" color="neutral">{timePeriod}</Typography>
      <Box sx={{ 
        mt: 3, 
        width: '100%', 
        height: 30, 
        background: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`, 
        borderRadius: '10px', 
        position: 'relative' 
      }}>
        <Box sx={{ 
          position: 'absolute', 
          left: 0, 
          bottom: 0, 
          width: '100%', 
          height: 2, 
          backgroundColor: barColor 
        }} />
      </Box>
    </Card>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  link?: string;
}

export const ActionCard = ({ title, description, buttonText, onClick, link }: ActionCardProps) => {
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    type: 'success',
  });

  const handleCopy = async () => {
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        setToast({ open: true, message: 'Link copied to clipboard!', type: 'info' });
      } catch {
        setToast({ open: true, message: 'Failed to copy link!', type: 'error' });
      }
    }
  };

  const handleClose = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Card variant="outlined" sx={{ gap: 0, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography level="title-md" variant="plain" sx={{ pb: 0.5 }}>{title}</Typography>
        <Typography level="body-xs" color="neutral">{description}</Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
          <Button 
            sx={{
              padding: '8px 20px',
              background: 'linear-gradient(rgba(2, 122, 242, 0.8), rgb(2, 107, 212))',
              color: '#fff',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem',
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
            onClick={onClick}
          >
            {buttonText}
          </Button>
          {link && (
            <Button 
              variant="plain"
              onClick={handleCopy} 
              sx={{ 
                minWidth: '40px', 
                padding: '8px', 
                borderRadius: '6px', 
                backgroundColor: 'transparent', 
                boxShadow: 'none',
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                }
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </Button>
          )}
        </Box>
      </Card>

      <ToastBar
        open={toast.open}
        onClose={handleClose}
        prompt={toast.message}
        success={toast.type === 'success'}
        neutral={toast.type === 'info'}
      />
    </>
  );
};