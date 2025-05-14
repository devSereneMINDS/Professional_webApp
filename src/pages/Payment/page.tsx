/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Button, Input, Stack, Modal, ModalDialog, ModalClose, DialogTitle, FormControl, FormLabel } from '@mui/joy';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import OrderList from './/components/OrderList';
import OrderTable from './components/OrderTable';
import PageViewBar from '../Dashboard/components/PageViewBar';
import { useState } from 'react';
import { Select, Option } from '@mui/joy';
import React from 'react';
import { useSelector } from 'react-redux';

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
    paymentStatus: string; // Added paymentStatus property
  }

  const [clients, setClients] = React.useState<TransformedClient[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const professionalId = useSelector((state: any) => state.professional?.data?.id);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
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
            age?: number;
            sex?: string;
            phone_number?: string;
            email?: string;
            disease?: string;
          }

          const transformedData: TransformedClient[] = data.data.map((client: ClientData) => ({
            id: client.id,
            name: client.name,
            profileImage: client.photo_url ? client.photo_url : null,
            ageSex: `${client.age || "N/A"}/${client.sex || "N/A"}`,
            phoneNumber: client.phone_number || "N/A",
            email: client.email || "N/A",
            diagnosis: client.disease || "N/A",
          })).map((client: any) => ({
            ...client,
            paymentStatus: "Confirmed", // Assign a default or derived value for paymentStatus
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
  }, [professionalId, API_BASE_URL]);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes('')
  );

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    ifscCode: '',
    bankAccount: '',
    branch: '',
    notes: '',
    accountType: '' // Added accountType property
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChange1 = (event: any, value: string | null) => {
    const name = event?.target?.name || "accountType";
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setOpen(false);
    setFormData({
      bankName: '',
      ifscCode: '',
      bankAccount: '',
      branch: '',
      notes: '',
      accountType: '' // Added accountType with a default value
    });
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', // Changed from 100dvh to 100vh for more consistent behavior
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
            minHeight: 0, // Allows content to determine height
            height: 'auto', // Changed from fixed height to auto
            gap: 2,
          }}
        >
          {/* Breadcrumbs and Date */}
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

          {/* Title and Button */}
          <Box
            sx={{
              display: 'flex',
              mb: 3,
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h2" component="h1">
              Payments
            </Typography>
            <Button
              variant="solid"
              color="success"
              onClick={() => setOpen(true)}
              sx={{ width: { xs: '100%', sm: 'auto' },
            background: 'linear-gradient(rgba(2, 122, 242, 0.8), rgb(2, 107, 212))',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'linear-gradient(rgba(2, 122, 242, 1), rgb(2, 94, 186))',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            },
            '&:active': {
              background: 'linear-gradient(rgba(1, 102, 202, 1), rgb(1, 82, 162))'
            } }}
            >
              Add to Payment Checkout
            </Button>
          </Box>

          <PageViewBar />
          
          {/* Tables - Removed fixed height constraints */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            mt: 2,
            flex: 1,
            minHeight: 0, // Allows content to scroll naturally
            overflow: 'visible', // Changed from hidden to visible
          }}>
            <OrderTable clients={filteredClients} isLoading={isLoading} />
            <OrderList clients={filteredClients} isLoading={isLoading} />
          </Box>

          {/* Payment Checkout Modal */}
          <Modal open={open} onClose={() => setOpen(false)}>
  <ModalDialog sx={{
    width: { xs: '90%', sm: '80%', md: '500px' },
    maxWidth: '100%',
    p: { xs: 2, sm: 3 },
    my: 'auto', // Centers modal vertically
    mx: 'auto', // Centers modal horizontally
  }}>
    <ModalClose />
    <DialogTitle>Add Payment Checkout Details</DialogTitle>
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <FormControl>
          <FormControl>
            <FormLabel>Account Holder Name</FormLabel>
            <Input 
              name="branch" 
              value={formData.branch} 
              onChange={handleChange} 
              required 
            />
          </FormControl>
          <FormLabel>Bank Name</FormLabel>
          <Input 
            name="bankName" 
            value={formData.bankName} 
            onChange={handleChange} 
            required 
          />
        </FormControl>

        <FormControl>
          <FormLabel>Bank Account Number</FormLabel>
          <Input 
            name="bankAccount" 
            type="number" 
            value={formData.bankAccount} 
            onChange={handleChange} 
            required 
          />
        </FormControl>
        
        <FormControl>
          <FormLabel>IFSC Code</FormLabel>
          <Input 
            name="ifscCode" 
            value={formData.ifscCode} 
            onChange={handleChange} 
            required 
          />
        </FormControl>
        
        <FormControl>
          <FormLabel>Branch</FormLabel>
          <Input 
            name="branch" 
            value={formData.branch} 
            onChange={handleChange} 
            required 
          />
        </FormControl>

        {/* New Account Type Select Input */}
        <FormControl>
          <FormLabel>Account Type</FormLabel>
          <Select
            name="accountType"
            value={formData.accountType || ''}
            onChange={handleChange1}
            required
          >
            <Option value="savings">Savings Account</Option>
            <Option value="current">Current Account</Option>
          </Select>
        </FormControl>

        <Button 
          type="submit" 
          color="primary"
          fullWidth
          sx={{ 
            mt: 1,
            width: { xs: '100%', sm: 'auto' },
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'linear-gradient(rgba(2, 122, 242, 1), rgb(2, 94, 186))',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            },
            '&:active': {
              background: 'linear-gradient(rgba(1, 102, 202, 1), rgb(1, 82, 162))'
            }
          }}
        >
          Submit Payment Details
        </Button>
      </Stack>
    </form>
  </ModalDialog>
</Modal>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}