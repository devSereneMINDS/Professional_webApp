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
import { Input, Stack, CircularProgress } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import SessionsChart from './components/SessionChart';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import PageViewsBarChart from './components/PageViewBar';
import { useSelector } from 'react-redux';
import { StatCard, ActionCard } from './components/DashboardCard';
import { RootState } from '../../store/store';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { closeSidebar } from '../../components/utils';
import ConfirmationSnackbar  from '../../components/Snackbar'
import React from 'react';

interface ProfessionalData {
  id?: string;
  full_name?: string;
  email?: string;
  photo_url?: string;
}

interface PaymentStats {
  totalAppointments: number;
  distinctClientsThisMonth: number;
  totalFeesThisMonth: number;
}

interface SearchResult {
  id: string;
  name: string;
  type: 'client' | 'professional';
}

interface SearchResponse {
  clients?: SearchResult[];
  professionals?: SearchResult[];
}

function SearchInput({ professionalId }: { professionalId?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);




const fetchSearchResults = async (query: string) => {
  if (!query || !professionalId) {
    setSearchResults([]);
    return;
  }

  setIsLoading(true);
  try {
    const response = await axios.get<SearchResponse>(
      `${import.meta.env.VITE_API_BASE_URL}/professionals/search/${query}/${professionalId}`
    );
    
    // Handle both possible response structures:
    // 1. Direct response with clients/professionals
    // 2. Response with data property containing clients/professionals
    const responseData: SearchResponse =
      typeof response.data === 'object' &&
      response.data !== null &&
      'data' in response.data &&
      typeof (response.data as { data?: unknown }).data === 'object'
        ? (response.data as { data: SearchResponse }).data
        : response.data;

    const results: SearchResult[] = [
      ...(responseData.clients?.map(c => ({ ...c, type: 'client' as const })) || []),
      ...(responseData.professionals?.map(p => ({ ...p, type: 'professional' as const })) || [])
    ];

    setSearchResults(results);
    setShowSuggestions(true);
  } catch (error) {
    // Check if this is a 404 with actual data in the response
    if (axios.isAxiosError(error) && error.response?.data?.data) {
      const responseData = error.response.data.data;
      const results: SearchResult[] = [
        ...(responseData.clients?.map((c: SearchResult) => ({ ...c, type: 'client' as const })) || []),
        ...(responseData.professionals?.map((p: SearchResult) => ({ ...p, type: 'professional' as const })) || [])
      ];
      setSearchResults(results);
      setShowSuggestions(true);
    } else {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSearchResults(value);
    }, 500);
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(`/${result.type}s/${result.id}`);
    setShowSuggestions(false);
    setSearchTerm('');
  };

  return (
    <div ref={searchRef} style={{ position: 'relative' }}>
      <Input
        size="sm"
        placeholder="Search clients or professionals"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => searchTerm && setShowSuggestions(true)}
        startDecorator={<SearchIcon />}
        endDecorator={isLoading ? <CircularProgress size="sm" /> : null}
        sx={{
          width: { xs: 150, sm: 200, md: 250 },
          minWidth: 150,
          '& input': {
            padding: '0.5rem',
          },
        }}
      />

      {showSuggestions && searchResults.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: 'background.popup',
            border: '1px solid',
            borderColor: 'neutral.outlinedBorder',
            borderRadius: 'sm',
            boxShadow: 'md',
            marginTop: 1,
            maxHeight: 300,
            overflowY: 'auto'
          }}
        >
          {searchResults.map((result) => (
            <Box
              key={`${result.type}-${result.id}`}
              sx={{
                padding: '8px 12px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'background.level1'
                }
              }}
              onClick={() => handleResultClick(result)}
            >
              {result.name} ({result.type})
            </Box>
          ))}
        </Box>
      )}

      {showSuggestions && searchResults.length === 0 && searchTerm && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: 'background.popup',
            border: '1px solid',
            borderColor: 'neutral.outlinedBorder',
            borderRadius: 'sm',
            boxShadow: 'md',
            marginTop: 1,
            padding: '8px 12px',
            color: 'text.tertiary'
          }}
        >
          No results found
        </Box>
      )}
    </div>
  );
}

export default function JoyOrderDashboardTemplate() {
  const professional = useSelector((state: RootState) => state.professional as { data?: ProfessionalData });
  const { stats } = useSelector((state: RootState) => state.paymentStats) as {
    stats: PaymentStats | null;
    status: string;
    error: string | null;
  };

  const navigate = useNavigate();
  // Snackbar state and handlers
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnackbarOpen(true);
    }, 15000); // 30 seconds

    console.log("i did")

    return () => clearInterval(interval);
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleConfirm = () => {
    setSnackbarOpen(false);
    navigate('/settings')
    // Add any confirmation logic here
    
  };
 
  const NavigatePersonalWebsite = () => {
    window.location.href = `https://site.sereneminds.life/${professional?.data?.id}`;
  };

  const statCardsData = [
    {
      title: 'Appointments',
      value: `${stats?.totalAppointments || 0}`,
      timePeriod: 'Last 30 days',
      gradientColors: ['#C8FAD9', '#D4FDE1'] as [string, string],
      barColor: '#00A36C'
    },
    {
      title: 'Distinct Clients',
      value: `${stats?.distinctClientsThisMonth || 0}`,
      timePeriod: 'Last 30 days',
      gradientColors: ['#FAD4D4', '#FDE1E1'] as [string, string],
      barColor: '#D32F2F'
    },
    {
      title: 'Earnings',
      value: `${stats?.totalFeesThisMonth || 0}`,
      timePeriod: 'Last 30 days',
      gradientColors: ['#E8EAF6', '#F0F2FA'] as [string, string],
      barColor: '#3F51B5'
    }
  ];

  const actionCardData = {
    title: 'Explore Your Page ✨',
    description: 'Share this link to your linkedIn, Instagram, or any other social media platform to build your brand and showcase your services.',
    buttonText: 'Go to your page',
    onClick: NavigatePersonalWebsite,
    link: `https://site.sereneminds.life/${professional?.data?.id}`
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
          onClick = {() => closeSidebar()}
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
          <Stack 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              width: '100%',
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: 2,
              mb: 2
            }}
          >
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

            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'space-evenly', sm: 'flex-end' }
              }}
            >
              <SearchInput professionalId={professional?.data?.id} />
              
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
                <ConfirmationSnackbar 
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        onConfirm={handleConfirm}
      />

              {statCardsData.map((card, index) => (
                <StatCard
                  key={index}
                  title={card.title}
                  value={card.value}
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