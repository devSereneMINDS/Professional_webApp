import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProfessionalData } from '../../../store/slices/ProfessionalSlice';
import axios from 'axios';
import { Box, Stack, Typography, Tabs, TabList, Tab, Breadcrumbs, Link } from '@mui/joy';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { tabClasses } from '@mui/joy/Tab';
import PersonalInfo from './PersonalInfo';
import AboutMe from './AboutMe';
import EducationSection from './EducationSection';
import ServicesSection from './ServicesSection';
import AvailabilitySection from './AvailabilitySection';
import AccountsSection from './AccountHandle';
import { FormData, Service, AvailabilityDay } from './type';

export default function MyProfile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  interface ProfessionalState {
    data: {
      id: string;
      full_name: string;
      email: string;
      phone: string;
      area_of_expertise: string;
      country: string | null;
      about_me: string;
      education: { institute: string; degree: string; description: string }[];
      services: {
        serviceTitle: string;
        serviceDescription: string;
        duration: number;
        price: number;
        currency: string;
      }[];
      availability: Record<string, string>;
      photo_url: string;
      instagram_account?: string;
      linkedin_account?: string;
    };
  }

  const professional = useSelector((state: { professional: ProfessionalState }) => state.professional);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  
  console.log(saveSuccess)
  const [formData, setFormData] = React.useState<FormData>({
    photo_url: undefined,
    full_name: '',
    email: '',
    phone: '',
    area_of_expertise: '',
    country: null,
    about_me: '',
    education: [{ institute: '', degree: '', description: '' }],
    instagram_account: '',
    linkedin_account: ''
  });

  const [availability, setAvailability] = React.useState<AvailabilityDay[]>(
    professional?.data?.availability 
      ? Object.entries(professional.data.availability).map(([day, times]) => ({
          day,
          times: [times as string]
        }))
      : [{ day: '', times: [''] }]
  );

  const [services, setServices] = React.useState<Service[]>(
    professional?.data?.services 
      ? professional.data.services.map((service) => ({
          name: service.serviceTitle || '',
          description: service.serviceDescription || '',
          duration: String(service.duration) || '',
          price: String(service.price) || '',
          currency: service.currency || 'INR'
        }))
      : [{ name: '', description: '', duration: '', price: '', currency: 'INR' }]
  );

  React.useEffect(() => {
    if (professional?.data) {
      setFormData({
        photo_url: professional.data.photo_url || undefined,
        full_name: professional.data.full_name || '',
        email: professional.data.email || '',
        phone: professional.data.phone || '',
        area_of_expertise: professional.data.area_of_expertise || '',
        country: professional.data.country || null,
        about_me: professional.data.about_me || '',
        education: professional.data.education || [{ institute: '', degree: '', description: '' }],
        instagram_account: professional.data.instagram_account || '',
        linkedin_account: professional.data.linkedin_account || ''
      });
    }
  }, [professional]);

  const handleSaveProfile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);
    
    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        area_of_expertise: formData.area_of_expertise,
        country: formData.country,
        about_me: formData.about_me,
        education: formData.education,
        instagram_account: formData.instagram_account,
        linkedin_account: formData.linkedin_account
      };

      const response = await axios.put(
        `${API_BASE_URL}/professionals/update/${professional?.data?.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.data) {
        dispatch(setProfessionalData(response.data.data[0]));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveServices = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);
    
    try {
      const payload = {
        services: services.map(service => ({
          serviceTitle: service.name,
          serviceDescription: service.description,
          duration: Number(service.duration),
          price: Number(service.price),
          currency: service.currency
        }))
      };

      const response = await axios.put(
        `${API_BASE_URL}/professionals/update/${professional?.data?.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.data) {
        dispatch(setProfessionalData(response.data.data[0]));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Services update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAvailability = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);
    
    try {
      const payload = {
        availability: availability.reduce((acc: Record<string, string>, day) => {
          if (day.day && day.times[0]) {
            acc[day.day] = day.times[0];
          }
          return acc;
        }, {} as Record<string, string>)
      };

      const response = await axios.put(
        `${API_BASE_URL}/professionals/update/${professional?.data?.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.data) {
        dispatch(setProfessionalData(response.data.data[0]));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Availability update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      flex: 1, 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
          width: '100%',
          maxWidth: 'none',
          zIndex: 9995,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="small" />}
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
              Users
            </Link>
            <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
              My profile
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            My profile
          </Typography>
        </Box>
        <Tabs 
          defaultValue={0} 
          onChange={(_, value) => typeof value === 'number' && setActiveTab(value)} 
          sx={{ bgcolor: 'transparent' }}
        >
          <TabList
            tabFlex={1}
            size="sm"
            sx={{
              pl: { xs: 0, md: 4 },
              justifyContent: 'left',
              [`& .${tabClasses.root}`]: {
                fontWeight: '600',
                flex: 'initial',
                color: 'text.tertiary',
                [`&.${tabClasses.selected}`]: {
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  '&::after': {
                    height: '2px',
                    bgcolor: 'primary.500',
                  },
                },
              },
            }}
          >
            <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={0}>
              Settings
            </Tab>
            <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={1}>
              Services
            </Tab>
            <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={2}>
              Accounts
            </Tab>
          </TabList>
        </Tabs>
      </Box>
      
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        px: { xs: 2, md: 6 },
        py: { xs: 2, md: 3 },
      }}>
        <Stack
          spacing={4}
          sx={{
            width: '100%',
            maxWidth: '800px',
          }}
        >

          {activeTab === 0 ? (
            <>
              <PersonalInfo 
                formData={formData} 
                setFormData={setFormData} 
                professional={professional} 
                isLoading={isLoading} 
                onSave={handleSaveProfile}
              />
              <AboutMe 
                formData={formData} 
                setFormData={setFormData} 
                isLoading={isLoading} 
                onSave={handleSaveProfile}
              />
              <EducationSection 
                formData={formData} 
                setFormData={setFormData} 
                isLoading={isLoading} 
                onSave={handleSaveProfile}
              />
            </>
          ) : activeTab === 1 ? (
            <>
              {professional?.data?.area_of_expertise !== "Wellness Buddy" && (
      <ServicesSection 
        services={services} 
        setServices={setServices} 
        isLoading={isLoading} 
        onSave={handleSaveServices}
      />
    )}
              <AvailabilitySection 
                availability={availability} 
                setAvailability={setAvailability} 
                isLoading={isLoading} 
                onSave={handleSaveAvailability}
              />
            </>
          ) : (
            <AccountsSection 
              formData={formData} 
              setFormData={setFormData} 
              isLoading={isLoading} 
              onSave={handleSaveProfile}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
}
