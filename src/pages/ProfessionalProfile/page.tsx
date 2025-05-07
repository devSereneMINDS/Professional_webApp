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
import { Input, Stack } from '@mui/joy';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ProfileCard from './components/ProfileCard';

export default function JoyOrderDashboardTemplate() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100dvh',
        overflow: 'hidden',
        position: 'relative',
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
            gap: 1,
            overflow: 'auto',
            height: '100vh',
          }}
        >
          <Stack sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="sm" />}
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
                HomePage
              </Typography>
            </Breadcrumbs>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Input
                size="sm"
                type="date"
                value={today.format('YYYY-MM-DD')}
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
          <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box
              sx={{
                display: 'flex',
                mb: 1,
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'start', sm: 'center' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <Typography level="h2" component="h1">
                Welcome to your dashboard
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2,
                mt: 1,
              }}
            >
                <ProfileCard />
            </Box>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}