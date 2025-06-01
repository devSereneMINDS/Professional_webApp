/* eslint-disable @typescript-eslint/no-explicit-any */
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Divider from '@mui/joy/Divider';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AspectRatio, Box, Button, Card, CardContent, CircularProgress } from '@mui/joy';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import { useSelector } from 'react-redux';
import { db } from '../../../../firebaseConfig';
import { addDoc, arrayUnion, collection, doc, getDocs, query, serverTimestamp, updateDoc, where, getDoc } from 'firebase/firestore';
import { RootState } from '../../../store/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ClientProfile() {
  const { id } = useParams();
  const [professionalData, setProfessionalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('education');
  const [chatExists, setChatExists] = useState(false);
  const navigate = useNavigate();
    // Define the ProfessionalData type if not already imported
    type ProfessionalData = {
      uid?: string;
      full_name: string;
      email: string;
      phone?: string;
      photo_url?: string;
      area_of_expertise?: string;
      languages?: string[];
      country?: string;
      date_of_birth?: string;
      created_at?: string;
      about_me?: string;
      education?: Array<{
        degree: string;
        institute: string;
        description?: string;
      }>;
      availability?: { [key: string]: string };
      services?: Array<{
        serviceTitle: string;
        serviceDescription: string;
        price: number;
        currency: string;
        duration: number;
      }>;
    };
    
        const professional = useSelector((state: RootState) => state.professional as unknown as { data?: ProfessionalData });
  const currentUserUID = professional?.data?.uid;
  const professionalId = id;
console.log("afaf",professional)
  // Check if chat exists when component loads
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
        setProfessionalData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Check if a chat exists
    const checkChatExists = async () => {
      if (!currentUserUID || !professionalId) return;
      
      const userChatRef = doc(db, "userchats", currentUserUID);
      const userChatSnap = await getDoc(userChatRef);

      if (userChatSnap.exists() && userChatSnap.data().chats) {
        const existingChats = userChatSnap
          .data()
          .chats.map((chat: any) => chat.recieverId);
        setChatExists(existingChats.includes(professionalId));
      }
    };

    fetchProfessionalData();
    checkChatExists();
  }, [professionalId, currentUserUID]);

  const handleAddToChat = async (email: string) => {
    console.log("faa",currentUserUID)
    if (!currentUserUID || !professionalId) return;

    if (chatExists) {
      // If chat already exists, navigate to chat
      navigate("/chats");
      return;
    }

    setLoading(true);
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const selectedUser = { id: userDoc.id, ...userDoc.data() };

        // Create a new chat
        const chatRef = collection(db, "chats");
        const newChatRef = await addDoc(chatRef, {
          createdAt: serverTimestamp(),
          messages: [],
        });

        await updateDoc(doc(db, "userchats", selectedUser.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            recieverId: currentUserUID,
            updatedAt: Date.now(),
          }),
        });

        await updateDoc(doc(db, "userchats", currentUserUID), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            recieverId: selectedUser.id,
            updatedAt: Date.now(),
          }),
        });

        setChatExists(true);
        navigate("/chats");
      }
    } catch (error) {
      console.error("Error adding user to chat:", error);
    }
    setLoading(false);
  };

  const truncateText = (text: string, maxWords: number) => {
    if (!text) return "No information available";
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const aboutMeText = professionalData?.about_me || "No information available";
  const truncatedAboutMe = truncateText(aboutMeText, 65);
  const isTruncated = aboutMeText.split(' ').length > 65;

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

  if (!professionalData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Professional data not found</Typography>
      </Box>
    );
  }

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
      {/* Top Section - Profile and About Me */}
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
                src={professionalData.photo_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"}
                alt={professionalData.full_name}
              />
            </AspectRatio>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: "center",
              alignItems: { xs: 'center', sm: 'flex-start' },
              gap: 1
            }}>
              <Typography level="title-lg">{professionalData.full_name}</Typography>
              <Typography level="body-sm">{professionalData.email}</Typography>
              <Typography level="body-sm">{professionalData.phone}</Typography>
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
                onClick={() => handleAddToChat(professionalData.email)}
                disabled={loading}
              >
                {loading ? 'Loading...' : chatExists ? 'Chat with Professional' : 'Add to Chat'}
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
                <Typography level="body-xs" textColor="text.tertiary">Area of Expertise</Typography>
                <Typography level="body-md">{professionalData.area_of_expertise || "Not Available"}</Typography>
              </Box>
              
              <Box>
                <Typography level="body-xs" textColor="text.tertiary">Languages</Typography>
                <Typography level="body-md">
                  {professionalData.languages?.join(', ') || "Not Available"}
                </Typography>
              </Box>
            </Box>

            {/* Second Column */}
            <Box sx={{ flex: 1, minWidth: 150, p: 0, m: 0 }}>
              <Box mb={2}>
                <Typography level="body-xs" textColor="text.tertiary">Country</Typography>
                <Typography level="body-md">{professionalData.country || "Not Available"}</Typography>
              </Box>
              
              <Box>
                <Typography level="body-xs" textColor="text.tertiary">Date of Birth</Typography>
                <Typography level="body-md">
                  {professionalData.date_of_birth ? new Date(professionalData.date_of_birth).toLocaleDateString() : "Not Available"}
                </Typography>
              </Box>
            </Box>

            {/* Third Column */}
            <Box sx={{ flex: 1, minWidth: 150, p: 0, m: 0 }}>
              <Box>
                <Typography level="body-xs" textColor="text.tertiary">Member Since</Typography>
                <Typography level="body-md">
                  {professionalData.created_at ? new Date(professionalData.created_at).toLocaleDateString() : "Not Available"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>

        {/* About Me Card */}
        <Card sx={{ 
          flex: { xs: '1 1 auto', md: 2 },
          display: 'flex',
          flexDirection: 'column'
        }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography level="title-lg" sx={{ mb: 2 }}>About Me</Typography>
            <Typography level="body-md" sx={{ mb: isTruncated ? 2 : 0 }}>
              {truncatedAboutMe}
            </Typography>
            {isTruncated && (
              <Button 
                onClick={() => window.open(`https://site.sereneminds.life/${professionalId}`, '_blank')}
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
                Show More
              </Button>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Bottom Section - Tabs for Education and Availability */}
      <Card>
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
              <Tab value="education">Education</Tab>
              <Tab value="availability">Availability</Tab>
              <Tab value="services">Services</Tab>
            </TabList>
            
            <TabPanel value="education" sx={{ p: { xs: 1, sm: 2 } }}>
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
            
            <TabPanel value="availability" sx={{ p: { xs: 1, sm: 2 } }}>
              {professionalData.availability ? (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(auto-fill, minmax(250px, 1fr))' 
                  }, 
                  gap: 2 
                }}>
                  {Object.entries(professionalData.availability).map(([day, time]) => (
                    <Sheet 
                      key={day} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 'sm',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        minWidth: 0 // prevents overflow
                      }}
                    >
                      <Typography level="title-md" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {day}
                      </Typography>
                      <Typography level="body-md" sx={{ ml: 1, flexShrink: 0 }}>
                        {time as string || "Not Available"}
                      </Typography>
                    </Sheet>
                  ))}
                </Box>
              ) : (
                <Typography level="body-md" textColor="text.tertiary">
                  No availability information available
                </Typography>
              )}
            </TabPanel>

            <TabPanel value="services" sx={{ p: { xs: 1, sm: 2 } }}>
              {professionalData.services?.length > 0 ? (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(auto-fill, minmax(300px, 1fr))' 
                  }, 
                  gap: 2 
                }}>
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography level="body-md">
                          <strong>Price:</strong> {service.price} {service.currency}
                        </Typography>
                        <Typography level="body-md">
                          <strong>Duration:</strong> {service.duration}
                        </Typography>
                      </Box>
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
    </Box>
  );
}
