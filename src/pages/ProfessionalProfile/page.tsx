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
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ClientQnA {
  gender: string;
  'age-group': string;
  occupation: string;
  'marital-status': string;
}

interface ClientData {
  id: number;
  name: string;
  age: number | null;
  email: string;
  sex: string | null;
  phone_no: string;
  diagnosis: string | null;
  photo_url: string;
  zipcode: string | null;
  city: string | null;
  appointment_id: number | null;
  assessment_id: number | null;
  invoice_id: number | null;
  medical_record_id: number | null;
  created_at: string;
  updated_at: string;
  q_and_a: ClientQnA;
  uid: string;
  no_of_sessions: number;
}

export default function JoyOrderDashboardTemplate() {
  const { clientId } = useParams<{ clientId?: string }>(); 
  //const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [, setLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);

  console.log("Client ID",clientId)

  // Fetch client data when clientId changes
  useEffect(() => {
    if (clientId) {
      const fetchClientData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`https://api.sereneminds.life/api/clients2/${clientId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch client data');
          }
          const data: ClientData = await response.json();
          setClientData(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          console.error('Error fetching client data:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchClientData();
    } else {
      setClientData(null); // Clear data if no clientId
      setError(null);
      setLoading(false);
    }
  }, [clientId]);
  
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
                mt: 1,
                width: '100%',
              }}
            >
              <ProfileCard clientData={clientData}/>
            </Box>

          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
