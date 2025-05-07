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
        variant="contained" 
        href="/" 
        fullWidth
        sx={{ mt: 2 }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};