import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const CompletionStep: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 3,
      textAlign: 'center'
    }}>
      <Typography variant="h5" color="primary">
        Thank you for completing the onboarding process!
      </Typography>
      <Typography variant="body1">
      Welcome aboard! Your account is ready—take a deep breath and start exploring your journey with us.
      </Typography>
      <Button 
        href="/" 
        fullWidth
        sx={{ mt: 2, background: 'linear-gradient(rgba(2, 122, 242, 0.8), rgb(2, 107, 212))',
                    color: '#fff',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#fff',
                      background: 'linear-gradient(rgba(2, 122, 242, 1), rgb(2, 94, 186))',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    },
                    '&:active': {
                      background: 'linear-gradient(rgba(1, 102, 202, 1), rgb(1, 82, 162))'
                    } }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};