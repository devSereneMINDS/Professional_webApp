/* eslint-disable @typescript-eslint/no-explicit-any */
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Divider from '@mui/joy/Divider';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/joy';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Textarea from '@mui/joy/Textarea';

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

const OCCUPATION_MAP: { [key: string]: string } = {
  "0": "Student",
  "1": "Employed",
  "2": "Unemployed",
  "3": "Retired"
};

const MARITAL_STATUS_MAP: { [key: string]: string } = {
  "0": "Single",
  "1": "Married",
  "2": "Divorced",
  "3": "Widowed"
};

export default function ClientProfile() {
  const appointments = useSelector((state: RootState) => state.appointments);
  const { id } = useParams();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const clientID = id;

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (!clientID) {
          console.log("No client id found");
          return;
        }
        const response = await fetch(`${API_BASE_URL}/clients2/${clientID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch client data");
        }
        const data = await response.json();
        console.log("Client data fetched:", data);

        
        setClientData(data);
        setNotes(data.notes || ''); // Initialize notes from client data if available
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientID]);

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clients2/${clientID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      setIsEditingNotes(false);
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="danger">Error: {error}</Typography>
      </Box>
    );
  }

  if (!clientData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Client data not found</Typography>
      </Box>
    );
  }

  // Calculate completed and upcoming appointments count
  const completedCount = appointments.completed?.length || 0;
  const upcomingCount = appointments.upcoming?.length || 0;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 2,
      width: '100%',
      p: { xs: 1, sm: 2 },
      maxWidth: '1400px',
      mx: 'auto'
    }}>
      {/* Top Section - Profile and Personal Details */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%'
      }}>
        {/* Profile Card */}
        <Card sx={{ 
          flex: { xs: '1 1 auto', md: 3 },
          minWidth: 0 // prevents overflow
        }}>
          <CardContent sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <AspectRatio 
              ratio="1" 
              sx={{ 
                width: { xs: 120, sm: 200 }, 
                borderRadius: 'sm',
                alignSelf: 'center'
              }}
            >
              <img
                src={clientData.photo_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"}
                alt={clientData.name}
              />
            </AspectRatio>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: "center",
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 1
            }}>
              <Typography level="title-lg">{clientData.name}</Typography>
              
              <Typography level="body-sm">{clientData.email}</Typography>
              <Typography level="body-sm">{clientData.phone_no}</Typography>

              {/* Completed and Upcoming Appointments */}
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography level="body-sm" textColor="text.tertiary">Completed</Typography>
                  <Typography level="title-md">{completedCount}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography level="body-sm" textColor="text.tertiary">Upcoming</Typography>
                  <Typography level="title-md">{upcomingCount}</Typography>
                </Box>
              </Box>
              <Button 
                variant="outlined" 
                size="sm" 
                sx={{
                  mt: 2,
                  px: 4,
                  background: 'linear-gradient(rgba(2, 122, 242, 0.8), rgb(2, 107, 212))',
                  color: '#fff',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 400,
                  fontSize: '0.875rem',
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
                Add to Chat
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Personal Details Card */}
        <Card sx={{ 
          flex: { xs: '1 1 auto', md: 2 },
          p: { xs: 1, sm: 2, md: 3 }
        }}>
          <Typography level="title-lg" mb={2}>Personal Details</Typography>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 4 },
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            {/* First Column */}
            <Box sx={{ flex: 1, minWidth: 150, p: 0, m: 0 }}>
              <Box mb={2}>
                <Typography level="body-xs" textColor="text.tertiary">Gender</Typography>
                <Typography level="body-md">{clientData.q_and_a?.gender ? GENDER_MAP[clientData.q_and_a.gender] : "Not Available"}</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography level="body-xs" textColor="text.tertiary">Age</Typography>
                <Typography level="body-md">{clientData.q_and_a?.["age-group"] ? AGE_GROUP_MAP[clientData.q_and_a["age-group"]] : "Not Available"}</Typography>
              </Box>
            </Box>

            {/* Second Column */}
            <Box sx={{ flex: 1, minWidth: 150, p: 0, m: 0 }}>
              <Box mb={2}>
                <Typography level="body-xs" textColor="text.tertiary">Occupation</Typography>
                <Typography level="body-md">{clientData.q_and_a?.occupation ? OCCUPATION_MAP[clientData.q_and_a.occupation] : "Not Available"}</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography level="body-xs" textColor="text.tertiary">Marital Status</Typography>
                <Typography level="body-md">{clientData.q_and_a?.["marital-status"] ? MARITAL_STATUS_MAP[clientData.q_and_a["marital-status"]] : "Not Available"}</Typography>
              </Box>
            </Box>

            {/* Third Column */}
            <Box sx={{ flex: 1, minWidth: 150, p: 0, m: 0 }}>
              <Box mb={2}>
                <Typography level="body-xs" textColor="text.tertiary">Diagnosis</Typography>
                <Typography level="body-md">{clientData.diagnosis || "Not Available"}</Typography>
              </Box>
              
              <Box>
                <Typography level="body-xs" textColor="text.tertiary">Member Since</Typography>
                <Typography level="body-md">
                  {clientData.created_at ? new Date(clientData.created_at).toLocaleDateString() : "Not Available"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Notes Card */}
        <Card sx={{ 
          flex: { xs: '1 1 auto', md: 2 },
          display: 'flex',
          flexDirection: 'column'
        }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography level="title-lg" sx={{ mb: 2 }}>Notes</Typography>
            
            {isEditingNotes ? (
              <>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  minRows={4}
                  maxRows={8}
                  sx={{ mb: 2 }}
                  placeholder="Write your notes here..."
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={handleSaveNotes}
                    loading={isSavingNotes}
                    sx={{
                      background: 'linear-gradient(rgba(2, 122, 242, 0.8), rgb(2, 107, 212))',
                      color: '#fff',
                      '&:hover': {
                        background: 'linear-gradient(rgba(2, 122, 242, 1), rgb(2, 94, 186))',
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditingNotes(false)}
                    disabled={isSavingNotes}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography 
                  level="body-md" 
                  sx={{ 
                    mb: 2, 
                    whiteSpace: 'pre-wrap',
                    minHeight: '100px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setIsEditingNotes(true)}
                >
                  {notes || 'Click to add notes...'}
                </Typography>
                {
                    notes? <><Button 
                  onClick={() => setIsEditingNotes(true)}
                  sx={{
                    background: 'linear-gradient(rgba(2, 122, 242, 0.8), rgb(2, 107, 212))',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(rgba(2, 122, 242, 1), rgb(2, 94, 186))',
                    }
                  }}
                >
                  {notes ? 'Edit Notes' : 'Add Notes'}
                </Button></>
                : ''
                }
                
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Bottom Section - Tabs and Medical Assessment */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        flexDirection: { xs: 'column', lg: 'row' },
        width: '100%'
      }}>
        {/* Appointments Tabs Card */}
        <Card sx={{ flex: { xs: '1 1 auto', lg: 3 } }}>
          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Tabs 
              value={activeTab} 
              onChange={(_event, newValue) => setActiveTab(newValue as string)}
              sx={{
                '& .MuiTabs-flexContainer': {
                  flexWrap: 'wrap'
                }
              }}
            >
              <TabList>
                <Tab value="upcoming">Upcoming ({upcomingCount})</Tab>
                <Tab value="completed">Completed ({completedCount})</Tab>
              </TabList>
              
              <TabPanel value="upcoming" sx={{ p: { xs: 1, sm: 2 } }}>
                {appointments.upcoming?.length > 0 ? (
                  appointments.upcoming.map((appointment: any, index: number) => (
                    <Sheet 
                      key={index} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 'sm', 
                        mb: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                      }}
                    >
                      <Typography level="title-lg">{appointment.service}</Typography>
                      <Typography level="body-md">
                        <strong>Date & Time:</strong> {formatDate(appointment.appointment_time)}
                      </Typography>
                      <Typography level="body-md">
                        <strong>Duration:</strong> {appointment.duration}
                      </Typography>
                      {appointment.message && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <Typography level="body-md">
                            <strong>Message:</strong> {appointment.message}
                          </Typography>
                        </>
                      )}
                    </Sheet>
                  ))
                ) : (
                  <Typography level="body-md" textColor="text.tertiary">
                    No upcoming appointments
                  </Typography>
                )}
              </TabPanel>
              
              <TabPanel value="completed" sx={{ p: { xs: 1, sm: 2 } }}>
                {appointments.completed?.length > 0 ? (
                  appointments.completed.map((appointment: any, index: number) => (
                    <Sheet 
                      key={index} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 'sm', 
                        mb: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                      }}
                    >
                      <Typography level="title-lg">{appointment.service}</Typography>
                      <Typography level="body-md">
                        <strong>Date & Time:</strong> {formatDate(appointment.appointment_time)}
                      </Typography>
                      <Typography level="body-md">
                        <strong>Duration:</strong> {appointment.duration}
                      </Typography>
                      {appointment.message && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <Typography level="body-md">
                            <strong>Message:</strong> {appointment.message}
                          </Typography>
                        </>
                      )}
                    </Sheet>
                  ))
                ) : (
                  <Typography level="body-md" textColor="text.tertiary">
                    No completed appointments
                  </Typography>
                )}
              </TabPanel>
            </Tabs>
          </CardContent>
        </Card>

        {/* Medical Assessment Card */}
        <Card sx={{ flex: { xs: '1 1 auto', lg: 1 } }}>
          <CardContent>
            <Typography level="title-lg" sx={{ mb: 2 }}>Medical Assessment</Typography>
            
            {clientData.assessment_id ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography level="body-xs" textColor="text.tertiary">Diagnosis</Typography>
                  <Typography level="body-md">{clientData.diagnosis || "Not Available"}</Typography>
                </Box>
                
                <Box>
                  <Typography level="body-xs" textColor="text.tertiary">Treatment Plan</Typography>
                  <Typography level="body-md">{clientData.treatment_plan || "Not Available"}</Typography>
                </Box>
                
                <Box>
                  <Typography level="body-xs" textColor="text.tertiary">Medications</Typography>
                  <Typography level="body-md">{clientData.medications || "Not Available"}</Typography>
                </Box>
                
                <Box>
                  <Typography level="body-xs" textColor="text.tertiary">Notes</Typography>
                  <Typography level="body-md">{clientData.medical_notes || "Not Available"}</Typography>
                </Box>
              </Box>
            ) : (
              <Typography level="body-md" textColor="text.tertiary">
                No medical assessment available
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
