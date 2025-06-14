/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import { useSelector } from 'react-redux';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import SearchIcon from '@mui/icons-material/Search';

import Sidebar from '../../components/Slidebar';
import OrderTable from './components/OrderTable';
import OrderList from './components/OrderList';
import Header from '../../components/Header';
import Input from '@mui/joy/Input';
import { Stack } from '@mui/joy';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GENDER_MAP: { [key: string]: string } = {
  "0": "Male",
  "1": "Female",
  "2": "Other"
};

const AGE_GROUP_MAP: { [key: string]: string } = {
  "0": "Under 18",
  "1": "18-30",
  "2": "31-50",
  "3": "51+"
};

export default function JoyOrderDashboardTemplate() {
  interface TransformedClient {
    id: string;
    name: string;
    profileImage: string | null;
    ageSex: string;
    phoneNumber: string;
    email: string;
    diagnosis: string;
    status: string;
  }

  const [clients, setClients] = React.useState<TransformedClient[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const professionalId = useSelector((state: any) => state.professional?.data?.id);

  // Fetch clients from API
React.useEffect(() => {
    if (!professionalId) return;

    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/appointment/clients/appointments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ professionalId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const data = await response.json();
        if (Array.isArray(data.data)) {
          interface ClientData {
            id: string;
            name: string;
            photo_url?: string | null;
            phone_number?: string;
            email?: string;
            diagnosis?: string;
            gender?: string;
            agegroup?: string;
          }

          const transformedData: TransformedClient[] = data.data.map((client: ClientData) => ({
            id: client.id,
            name: client.name,
            profileImage: client.photo_url ? client.photo_url : null,
            ageSex: `${client.agegroup ? AGE_GROUP_MAP[client.agegroup] : "N/A"} / ${client.gender ? GENDER_MAP[client.gender] : "N/A"}`,
            phoneNumber: client.phone_number || "N/A",
            email: client.email || "N/A",
            diagnosis: client.diagnosis || "N/A",
            status: "Confirmed", // Default status, adjust as needed
          }));
          setClients(transformedData);
        } else {
          console.error("Unexpected data format:", data);
          setClients([]);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [professionalId]);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
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
            height: '100dvh',
            gap: 1,
          }}
        >
          <Stack sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',flexDirection: { xs: 'row', sm: 'row' }, gap: 1 }}>
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
                Clients
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
              mb: 1,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h2" component="h1">
              My Clients
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Input
                size="sm"
                placeholder="Search clients"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startDecorator={<SearchIcon />}
                sx={{ width: 300 }}
              />
            </Box>
          </Box>
          <OrderTable clients={filteredClients} isLoading={isLoading} />
          <OrderList clients={filteredClients} isLoading={isLoading} />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
