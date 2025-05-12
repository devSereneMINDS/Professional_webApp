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
import EducationSection from './EducationSection.tsx';
import ServicesSection from './ServicesSection.tsx';
import AvailabilitySection from './AvailabilitySection';
import AccountsSection from './AccountHandle.tsx';
import { FormData, Service, AvailabilityDay } from './type.ts';

export default function MyProfile() {
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
    };
  }

  const professional = useSelector((state: { professional: ProfessionalState }) => state.professional);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const [formData, setFormData] = React.useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    area_of_expertise: '',
    country: null,
    about_me: '',
    education: [{ institute: '', degree: '', description: '' }],
     instagram: '',
    facebook: ''
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
      ? professional.data.services.map((service: { serviceTitle: string; serviceDescription: string; duration: number; price: number; currency: string }) => ({
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
        full_name: professional.data.full_name || '',
        email: professional.data.email || '',
        phone: professional.data.phone || '',
        area_of_expertise: professional.data.area_of_expertise || '',
        country: professional.data.country ? String(professional.data.country) : null,
        about_me: professional.data.about_me || '',
        education: professional.data.education || [{ institute: '', degree: '', description: '' }],
         instagram: '',
        facebook: ''
      });
    }
  }, [professional]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const updatedProfessional = {
        ...professional.data,
        ...formData,
        services: services.map(service => ({
          serviceTitle: service.name,
          serviceDescription: service.description,
          duration: Number(service.duration),
          price: Number(service.price),
        })),
        availability: availability.reduce((acc: Record<string, string>, day) => {
          if (day.day && day.times[0]) {
            acc[day.day] = day.times[0];
          }
          return acc;
        }, {} as Record<string, string>)
      };

      console.log('Updated Professional:', updatedProfessional);

      const response = await axios.put(
        `https://api.sereneminds.life/api/professionals/update/${professional?.data?.id}`,
        updatedProfessional
      );

      dispatch(setProfessionalData(response.data));
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveServices = async () => {
    setIsLoading(true);
    try {
      const updatedProfessional = {
        ...professional.data,
        services: services.map(service => ({
          serviceTitle: service.name,
          serviceDescription: service.description,
          duration: Number(service.duration),
          price: Number(service.price),
        }))
      };
      const response = await axios.put(
        `https://api.sereneminds.life/api/professionals/${professional.data.id}`,
        updatedProfessional
      );

      dispatch(setProfessionalData(response.data));
    } catch (error) {
      console.error('Error updating services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAvailability = async () => {
    setIsLoading(true);
    try {
      const updatedProfessional = {
        ...professional.data,
        availability: availability.reduce((acc: Record<string, string>, day) => {
          if (day.day && day.times[0]) {
            acc[day.day] = day.times[0];
          }
          return acc;
        }, {} as Record<string, string>)
      };


      const response = await axios.put(
        `https://api.sereneminds.life/api/professionals/${professional.data.id}`,
        updatedProfessional
      );

      dispatch(setProfessionalData(response.data));
    } catch (error) {
      console.error('Error updating availability:', error);
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
        <Tabs defaultValue={0} onChange={(_, value) => typeof value === 'number' && setActiveTab(value)} sx={{ bgcolor: 'transparent' }}>
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
    <ServicesSection 
      services={services} 
      setServices={setServices} 
      isLoading={isLoading} 
      onSave={handleSaveServices}
    />
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