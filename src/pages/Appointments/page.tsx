import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Sidebar from '../../components/Slidebar';
import Header from '../../components/Header';
import AppointmentList from './components/AppointmentList';
import { useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Input, Stack } from '@mui/joy';
import dayjs from 'dayjs';

export default function JoyOrderDashboardTemplate() {
  interface RootState {
    appointment: { id: string; date: string; time: string; clientName: string; status: string };
  }

  const appointment = useSelector((state: RootState) => state.appointment);
  console.log('appointment', appointment);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        width: '100vw',
        overflow: 'hidden'
      }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100vh',
            gap: 1,
            overflow: 'hidden',
          }}
        >
          <Stack sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '100%',
            flexDirection: { xs: 'row', sm: 'row' }, 
            gap: 1,
            flexShrink: 0
          }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="#some-link"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="#some-link"
                sx={{ fontSize: 12, fontWeight: 500 }}
              >
                Dashboard
              </Link>
              <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
                Appointments
              </Typography>
            </Breadcrumbs>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Input
                size="sm"
                value={dayjs().format('YYYY-MM-DD')}
                readOnly
                sx={{
                  width: 120,
                  '& input': {
                    padding: '0px',
                    textAlign: 'center',
                  },
                  '& input::placeholder': {
                    color: 'text.placeholder',
                  }
                }}
              />
            </LocalizationProvider>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              mb: 2,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: '',
              flexShrink: 0
            }}
          >
            <Typography level="h2" component="h1">
              Appointments
            </Typography>
          </Box>
          
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            position: 'relative'
          }}>
            <AppointmentList />
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}