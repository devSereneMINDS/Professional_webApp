/* eslint-disable @typescript-eslint/no-explicit-any */
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Divider from '@mui/joy/Divider';
import Stack from '@mui/joy/Stack';
import { useState, useEffect } from 'react';
// import Textarea from '@mui/joy/Textarea';
// import EditNoteIcon from '@mui/icons-material/EditNote';
// import SaveIcon from '@mui/icons-material/Save';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/joy';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ClientProfile() {
  const { id } = useParams();
  const [professionalData, setProfessionalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [notes, setNotes] = useState("");
  // const [isNotesEditable, setIsNotesEditable] = useState(false);
  const [activeTab, setActiveTab] = useState('education');

  const professionalId = id;

  useEffect(() => {
    const fetchProfessionalData = async () => {
      try {
        if (!professionalId) {
          console.log("No professional id found");
          return;
        }
        const response = await fetch(`${API_BASE_URL}/professionals/${professionalId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch professional data");
        }
        const data = await response.json();
        console.log("data", data)
        setProfessionalData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionalData();
  }, [professionalId]);

  // const toggleNotesEdit = () => {
  //   setIsNotesEditable(!isNotesEditable);
  // };

  // const saveNotes = () => {
  //   console.log("Notes saved:", notes);
  //   setIsNotesEditable(false);
  // };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (error) {
    return <Typography color="danger">Error: {error}</Typography>;
  }

  if (!professionalData) {
    return <Typography>Professional data not found</Typography>;
  }

  return (
    <Box sx={{ 
  display: 'flex', 
  flexDirection: 'column',
  gap: 2,
  width: '100%',
  p: 2,
}}>

      {/* Top Section - Profile and About Me */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        flexDirection: { xs: 'column', md: 'row' },
        width:'100%'
      }}>
        {/* Profile Card - 3/5 width */}
        <Card sx={{ flex: 3 }}>
          <CardContent sx={{
            flexDirection:"row",
            display:"flex"
          }}>
            <Box sx={{ display: 'flex',flexDirection:"column", gap: 3, mb: 1,justifyContent: "center", alignItems:"center" }}>
              <AspectRatio ratio="1" sx={{ width: 150, borderRadius: 'sm' }}>
                <img
                  src={professionalData.photo_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"}
                  alt={professionalData.full_name}
                />
              </AspectRatio>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems:"center" }}>
                <Typography level="body-lg">{professionalData.full_name}</Typography>
                <Typography level="body-md">{professionalData.email}</Typography>
                <Typography level="body-md">{professionalData.phone}</Typography>
                <Button 
                  variant="outlined" 
                  size="sm" 
                  sx={{
                    marginTop:'20px',
    padding: '8px 40px',
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
            </Box>
            
          </CardContent>
        </Card>

 <Card sx={{ p: 3 }}>
  <Typography level="title-lg" mb={2}>Personal Details</Typography>

  <Stack
    direction="row"
    spacing={4} // horizontal spacing between columns
    sx={{  rowGap: 4, columnGap: 4 }} // add vertical and horizontal spacing for wrapping
  >
    <Box display="flex" flexDirection="column" gap={2}>
      <Box>
        <Typography level="body-xs" textColor="text.tertiary" noWrap>Area of Expertise</Typography>
        <Typography level="body-md" noWrap>{professionalData.area_of_expertise || "Not Available"}</Typography>
      </Box>

      <Box>
        <Typography level="body-xs" textColor="text.tertiary">Languages</Typography>
        <Typography level="body-md">
          {professionalData.languages?.join(', ') || "Not Available"}
        </Typography>
      </Box>

      <Box>
        <Typography level="body-xs" textColor="text.tertiary" noWrap>Country</Typography>
        <Typography level="body-md" noWrap>{professionalData.country || "Not Available"}</Typography>
      </Box>
    </Box>

    <Box display="flex" flexDirection="column" gap={2}>
      <Box>
        <Typography level="body-xs" textColor="text.tertiary" noWrap>Date of Birth</Typography>
        <Typography level="body-md" noWrap>
          {professionalData.date_of_birth ? new Date(professionalData.date_of_birth).toLocaleDateString() : "Not Available"}
        </Typography>
      </Box>

      <Box>
        <Typography level="body-xs" textColor="text.tertiary" noWrap>Member Since</Typography>
        <Typography level="body-md" noWrap>
          {professionalData.created_at ? new Date(professionalData.created_at).toLocaleDateString() : "Not Available"}
        </Typography>
      </Box>
    </Box>
  </Stack>
</Card>


        {/* About Me Card - 2/5 width */}
        <Card sx={{ flex: 2 }}>
          <CardContent>
            <Typography level="title-lg" sx={{ mb: 2 }}>About Me</Typography>
            <Typography level="body-md">
              {professionalData.about_me || "No information available"}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Bottom Section - Tabs for Education and Availability */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(_event, newValue) => setActiveTab(newValue as string)}>
            <TabList>
              <Tab value="education">Education</Tab>
              <Tab value="availability">Availability</Tab>
              <Tab value="services">Services</Tab>
            </TabList>
            
            <TabPanel value="education">
              {professionalData.education?.length > 0 ? (
                professionalData.education.map((edu: any, index: number) => (
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
                    <Typography level="title-lg">{edu.degree}</Typography>
                    <Typography level="title-sm" color="primary">{edu.institute}</Typography>
                    <Typography level="body-md">{edu.description}</Typography>
                  </Sheet>
                ))
              ) : (
                <Typography level="body-md" textColor="text.tertiary">
                  No education information available
                </Typography>
              )}
            </TabPanel>
            
            <TabPanel value="availability">
              {professionalData.availability ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {Object.entries(professionalData.availability).map(([day, time]) => (
                    <Sheet 
                      key={day} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 'sm',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Typography level="title-md">{day}</Typography>
                      <Typography level="body-md">{time as string || "Not Available"}</Typography>
                    </Sheet>
                  ))}
                </Box>
              ) : (
                <Typography level="body-md" textColor="text.tertiary">
                  No availability information available
                </Typography>
              )}
            </TabPanel>

            <TabPanel value="services">
              {professionalData.services?.length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {professionalData.services.map((service: any, index: number) => (
                    <Sheet 
                      key={index} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 'sm',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                      }}
                    >
                      <Typography level="title-lg">{service.serviceTitle}</Typography>
                      <Typography level="body-md">{service.serviceDescription}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography level="body-md">
                        <strong>Price:</strong> {service.price} {service.currency}
                      </Typography>
                      <Typography level="body-md">
                        <strong>Duration:</strong> {service.duration} minutes
                      </Typography>
                    </Sheet>
                  ))}
                </Box>
              ) : (
                <Typography level="body-md" textColor="text.tertiary">
                  No services available
                </Typography>
              )}
            </TabPanel>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notes Card
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography level="title-lg">Notes</Typography>
            {isNotesEditable ? (
              <Button
                size="sm"
                startDecorator={<SaveIcon />}
                onClick={saveNotes}
                color="success"
              >
                Save
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outlined"
                startDecorator={<EditNoteIcon />}
                onClick={toggleNotesEdit}
              >
                Edit
              </Button>
            )}
          </Box>
          
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about the professional..."
            minRows={4}
            readOnly={!isNotesEditable}
            variant={isNotesEditable ? "outlined" : "plain"}
            sx={{
              '& textarea': {
                cursor: isNotesEditable ? 'text' : 'pointer',
              },
              fontSize: 'md'
            }}
          />
        </CardContent>
      </Card> */}
    </Box>
  );
}