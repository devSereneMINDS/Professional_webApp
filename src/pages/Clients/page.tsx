import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import { useSelector } from 'react-redux';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import SearchIcon from '@mui/icons-material/Search';

import Sidebar from '../../components/Slidebar';
import OrderTable from './components/OrderTable';
import OrderList from './components/OrderList';
import Header from '../../components/Header';
import Input from '@mui/joy/Input';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function JoyOrderDashboardTemplate() {
  const [clients, setClients] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const professionalId = useSelector((state) => state.professional?.data?.id);

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
          const transformedData = data.data.map((client) => ({
            id: client.id,
            name: client.name,
            profileImage: client.photo_url ? client.photo_url : null,
            ageSex: `${client.age || "N/A"}/${client.sex || "N/A"}`,
            phoneNumber: client.phone_number || "N/A",
            email: client.email || "N/A",
            diagnosis: client.disease || "N/A",
            status: "Confirmed", // Default status, adjust as needed
          }));
          setClients(transformedData);
        } else {
          console.error("Unexpected data format:", data);
          setClients([]);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                Clients
              </Typography>
            </Breadcrumbs>
          </Box>
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
                sx={{ width: 250 }}
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