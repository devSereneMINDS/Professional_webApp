import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import AppTheme from '../../components/modules/AppTheme';
// import ColorModeSelect from '../../components/modules/ColorModeSelect';
import { OnboardingStepper } from './components/OnboardingStepper';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function SignInSide(props: { disableCustomTheme?: boolean }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        component="main"
        sx={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }}
      >
        {/* Left side with fixed background image - hidden on mobile */}
        {!isMobile && (
          <Box
            sx={{
              width: { md: '50%' },
              height: '100%',
              backgroundImage: 'url(../assets/Image1.jpeg)', // Replace with your image path
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
              display: { xs: 'none', md: 'block' },
            }}
          />
        )}
        
        {/* Right side with scrollable content - full width on mobile */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: { xs: 'flex-start', md: 'center' },
            p: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            maxWidth: { xs: '100%', sm: '600px' },
            py: { xs: 2, md: 0 }
          }}>
            <OnboardingStepper />
          </Box>
        </Box>
      </Stack>
    </AppTheme>
  );
}