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
import SessionsChart from './components/SessionChart';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import PageViewsBarChart from './components/PageViewBar';
import { useSelector } from 'react-redux';
import { StatCard, ActionCard } from './components/DashboardCard';
import { RootState } from '../../store/store';

interface ProfessionalData {
  id?: string;
  full_name?: string;
  email?: string;
  photo_url?: string;
}

// types/paymentStatsTypes.ts
interface PaymentStats {
  totalAppointments: number;
  distinctClientsThisMonth: number;
  totalFeesThisMonth: number;
  // ... other stats properties
}

export default function JoyOrderDashboardTemplate() {
    const professional = useSelector((state: RootState) => state.professional as { data?: ProfessionalData });

  const NavigatePersonalWebsite = () => {
    window.location.href = `https://site.sereneminds.life/${professional?.data?.id}`;
  };

  const { stats, status, error } = useSelector((state: RootState) => state.paymentStats) as {
    stats: PaymentStats | null;
    status: string;
    error: string | null;
  };
  console.log('Payment Stats:', stats, status, error);

  const statCardsData = [
    {
      title: 'Appointments',
      value: `${stats?.totalAppointments || 0}`,
      change: '+25%',
      changeColor: 'success.plainColor',
      timePeriod: 'Last 30 days',
      gradientColors: ['#C8FAD9', '#D4FDE1'] as [string, string],
      barColor: '#00A36C'
    },
    {
      title: 'Distinct Clients',
      value: `${stats?.distinctClientsThisMonth || 0}`,
      change: '-25%',
      changeColor: 'danger.plainColor',
      timePeriod: 'Last 30 days',
      gradientColors: ['#FAD4D4', '#FDE1E1'] as [string, string],
      barColor: '#D32F2F'
    },
    {
      title: 'Earnings',
      value: `${stats?.totalFeesThisMonth || 0}`,
      change: '+5%',
      changeColor: 'primary.plainColor',
      timePeriod: 'Last 30 days',
      gradientColors: ['#E8EAF6', '#F0F2FA'] as [string, string],
      barColor: '#3F51B5'
    }
  ];

  const actionCardData = {
    title: 'Explore Your Impact ✨',
    description: 'Showcase your expertise and journey through insightful data and achievements.',
    buttonText: 'Get insights',
    onClick: NavigatePersonalWebsite
  };

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
                HomePage
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
              {statCardsData.map((card, index) => (
                <StatCard
                  key={index}
                  title={card.title}
                  value={card.value}
                  change={card.change}
                  changeColor={card.changeColor}
                  timePeriod={card.timePeriod}
                  gradientColors={card.gradientColors}
                  barColor={card.barColor}
                />
              ))}
              <ActionCard {...actionCardData} />
            </Box>
            <SessionsChart />
            <PageViewsBarChart />
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}