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
import QRCode from 'react-qr-code';
import { Input, Stack, Button, IconButton, Card } from '@mui/joy';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface ProfessionalData {
  id?: string;
  full_name?: string;
  email?: string;
  photo_url?: string;
  banking_details?: {
    settlements?: any;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function JoyOrderDashboardTemplate() {
  const professional = useSelector((state: RootState) => state.professional as { data?: ProfessionalData });
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [link] = useState(`https://booking.sereneminds.life/${professional?.data?.id || ''}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      return;
    }

    if (!professional?.data?.full_name) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/send/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          content: link,
          psychologistName: professional?.data?.full_name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail("");
        setShowEmailInput(false);
      } else {
        console.error("Error sending email:", data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
  <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh', width: "100vw" }}>
        <Sidebar />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1,
          overflow: 'hidden' // This prevents double scroll bars
        }}>
          <Header />
          <Box
            component="main"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto', // This enables scrolling for the content
              p: { xs: 2, md: 3 },
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
                Add New Client
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
                width: '100%',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'start', sm: 'center' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
            </Box>
            
            {/* Client Appointment Content */}
            <Box sx={{ 
              flex: 1,
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3, 
              alignItems: 'center',
              p: 2
            }}>
              {/* {professional?.data?.banking_details?.settlements ? ( */}
                <>
                  <Typography level="h4" component="p" sx={{ textAlign: 'center' }}>
                    Share the link or scan the QR code to onboard the client
                  </Typography>

                  {/* Input field with copy button */}
                  <Box sx={{ 
                    display: 'flex', 
                    width: '100%',
                    maxWidth: '600px'
                  }}>
                    <Input
                      value={link}
                      readOnly
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .JoyInput-input': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }
                      }}
                    />
                    <IconButton
                      onClick={handleCopy}
                      variant="solid"
                      color="primary"
                      sx={{ ml: 1 }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>

                  {/* QR Code Display */}
                  <Card variant="outlined" sx={{ p: 2, borderRadius: 'sm' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 1
                    }}>
                       <QRCode 
      value={`https://booking.sereneminds.life/${professional?.data?.id}`} // The URL you want to encode
      size={200} // Adjust size (default: 256px)
      bgColor="#ffffff" // Background color (white)
      fgColor="#000000" // QR code color (black)
      level="Q" // Error correction level (L, M, Q, H)
    />
                      <Typography level="body-sm">Scan QR Code</Typography>
                    </Box>
                  </Card>

                  {/* Prompt to invite via email */}
                  <Typography level="body-sm" sx={{ textAlign: 'center' }}>
                    If unable to scan the QR code,{" "}
                    <Button
                      onClick={() => setShowEmailInput(!showEmailInput)}
                      variant="plain"
                      size="sm"
                      sx={{ p: 0 }}
                    >
                      enter email
                    </Button>{" "}
                    of the client to invite.
                  </Typography>

                  {/* Email input form */}
                  {showEmailInput && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 2, 
                      width: '100%',
                      maxWidth: '400px'
                    }}>
                      <Input
                        type="email"
                        placeholder="Enter client's email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                      />
                      <Button
                        onClick={handleEmailSubmit}
                        fullWidth
                        sx={{
                          background: 'linear-gradient(rgba(2, 122, 242, 0.8), rgb(2, 107, 212))',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'linear-gradient(rgba(2, 122, 242, 1), rgb(2, 94, 186))',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            },
            '&:active': {
              background: 'linear-gradient(rgba(1, 102, 202, 1), rgb(1, 82, 162))'
            }
                          }
                        }
                      >
                        Send Invitation
                      </Button>
                    </Box>
                  )}
                </>
              {/* ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography level="body-md">
                    Please add your bank details to start taking appointments from the payment page.
                  </Typography>
                </Box>
              )} */}
            </Box>
          </Box>
        </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}