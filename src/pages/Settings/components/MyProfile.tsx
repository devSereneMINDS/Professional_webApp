/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CountrySelector from './ContrySelector';
import EditorToolbar from './EditorToolbar';
import { useSelector, useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { setProfessionalData } from '../../../store/slices/ProfessionalSlice';
import axios from 'axios';

interface Service {
  name: string;
  description: string;
  duration: string;
  price: string;
  currency: string;
}

interface AvailabilityDay {
  day: string;
  times: string[];
}
interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  area_of_expertise: string;
  country: CountryType | null;  // Changed from string
  about_me: string;
}

export default function MyProfile() {
  const professional = useSelector((state: { professional: any }) => state.professional);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Form state
  const [formData, setFormData] = React.useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    area_of_expertise: '',
    country: null,
    about_me: '',
  });

  // Initialize availability
  const [availability, setAvailability] = React.useState<AvailabilityDay[]>(
    professional?.data?.availability 
      ? Object.entries(professional.data.availability).map(([day, times]) => ({
          day,
          times: [times as string]
        }))
      : [{ day: '', times: [''] }]
  );

  // Initialize services
  const [services, setServices] = React.useState<Service[]>(
    professional?.data?.services 
      ? professional.data.services.map((service: any) => ({
          name: service.serviceTitle || '',
          description: service.serviceDescription || '',
          duration: String(service.duration) || '',
          price: String(service.price) || '',
          currency: service.currency || 'INR'
        }))
      : [{ name: '', description: '', duration: '', price: '', currency: 'INR' }]
  );

  // Set form data when professional data is available
  React.useEffect(() => {
    if (professional?.data) {
      setFormData({
        full_name: professional.data.full_name || '',
        email: professional.data.email || '',
        phone: professional.data.phone || '',
        area_of_expertise: professional.data.area_of_expertise || '',
        country: professional.data.country || '',
        about_me: professional.data.about_me || '',
      });
    }
  }, [professional]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddService = () => {
    setServices([...services, { name: '', description: '', duration: '', price: '', currency: 'INR' }]);
  };

  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleAddDay = () => {
    setAvailability([...availability, { day: '', times: [''] }]);
  };

  const handleDayChange = (index: number, value: string | null) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].day = value || '';
    setAvailability(updatedAvailability);
  };

  const handleAddAvailabilityTime = (dayIndex: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].times.push('');
    setAvailability(updatedAvailability);
  };

  const handleAvailabilityTimeChange = (dayIndex: number, timeIndex: number, value: string) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].times[timeIndex] = value;
    setAvailability(updatedAvailability);
  };

  const handleRemoveAvailabilityTime = (dayIndex: number, timeIndex: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[dayIndex].times = updatedAvailability[dayIndex].times.filter((_, i) => i !== timeIndex);
    setAvailability(updatedAvailability);
  };

  const handleRemoveDay = (dayIndex: number) => {
    const updatedAvailability = availability.filter((_, i) => i !== dayIndex);
    setAvailability(updatedAvailability);
  };

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
          currency: service.currency
        })),
        availability: availability.reduce((acc: Record<string, string>, day) => {
          if (day.day && day.times[0]) {
            acc[day.day] = day.times[0];
          }
          return acc;
        }, {} as Record<string, string>)
      };

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
          currency: service.currency
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
              <Card>
                <Box sx={{ mb: 1 }}>
                  <Typography level="title-md">Personal info</Typography>
                  <Typography level="body-sm">
                    Customize how your profile information will appear to the networks.
                  </Typography>
                </Box>
                <Divider />
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
                >
                  <Stack direction="column" spacing={1}>
                    <AspectRatio
                      ratio="1"
                      maxHeight={200}
                      sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
                    >
                      <img
                        src={professional?.data?.photo_url}
                        srcSet={professional?.data?.photo_url}
                        loading="lazy"
                        alt=""
                      />
                    </AspectRatio>
                    <IconButton
                      aria-label="upload new picture"
                      size="sm"
                      variant="outlined"
                      color="neutral"
                      sx={{
                        bgcolor: 'background.body',
                        position: 'absolute',
                        zIndex: 2,
                        borderRadius: '50%',
                        left: 100,
                        top: 170,
                        boxShadow: 'sm',
                      }}
                    >
                      <EditRoundedIcon />
                    </IconButton>
                  </Stack>
                  <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <Stack spacing={1}>
                      <FormLabel>Name</FormLabel>
                      <FormControl
                        sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                      >
                        <Input 
                          size="sm" 
                          value={formData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <FormControl>
                        <FormLabel>Area of Expertise</FormLabel>
                        <Input 
                          size="sm" 
                          value={formData.area_of_expertise}
                          onChange={(e) => handleInputChange('area_of_expertise', e.target.value)}
                          placeholder="Enter your area of expertise"
                        />
                      </FormControl>
                      <FormControl sx={{ flexGrow: 1 }}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          size="sm"
                          type="email"
                          startDecorator={<EmailRoundedIcon />}
                          placeholder="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          sx={{ flexGrow: 1 }}
                        />
                      </FormControl>
                    </Stack>
                    <div>
                    <CountrySelector 
  value={formData.country}
  onChange={(newCountry) => {
    setFormData(prev => ({
      ...prev,
      country: newCountry
    }));
  }}
/>
                    </div>
                    <Input
                      size="sm"
                      type="tel"
                      startDecorator={<PhoneIcon />}
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                  </Stack>
                </Stack>
                <Stack
                  direction="column"
                  spacing={2}
                  sx={{ display: { xs: 'flex', md: 'none' }, my: 1 }}
                >
                  <Stack direction="row" spacing={2}>
                    <Stack direction="column" spacing={1}>
                      <AspectRatio
                        ratio="1"
                        maxHeight={108}
                        sx={{ flex: 1, minWidth: 108, borderRadius: '100%' }}
                      >
                        <img
                          src={professional?.data?.photo_url}
                          srcSet={professional?.data?.photo_url}
                          loading="lazy"
                          alt=""
                        />
                      </AspectRatio>
                      <IconButton
                        aria-label="upload new picture"
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        sx={{
                          bgcolor: 'background.body',
                          position: 'absolute',
                          zIndex: 2,
                          borderRadius: '50%',
                          left: 85,
                          top: 180,
                          boxShadow: 'sm',
                        }}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                    </Stack>
                    <Stack spacing={1} sx={{ flexGrow: 1 }}>
                      <FormLabel>Name</FormLabel>
                      <FormControl
                        sx={{
                          display: {
                            sm: 'flex-column',
                            md: 'flex-row',
                          },
                          gap: 2,
                        }}
                      >
                        <Input 
                          size="sm" 
                          value={formData.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                    </Stack>
                  </Stack>
                  <FormControl>
                    <FormLabel>Area of expertise</FormLabel>
                    <Input 
                      size="sm" 
                      value={formData.area_of_expertise}
                      onChange={(e) => handleInputChange('area_of_expertise', e.target.value)}
                      placeholder="Enter your area of expertise"
                    />
                  </FormControl>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      size="sm"
                      type="email"
                      startDecorator={<EmailRoundedIcon />}
                      placeholder="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                  </FormControl>
                  <div>
                  <CountrySelector 
  value={formData.country}
  onChange={(newCountry) => {
    setFormData(prev => ({
      ...prev,
      country: newCountry
    }));
  }}
/>
                  </div>
                </Stack>
                <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                  <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                    <Button size="sm" variant="outlined" color="neutral">
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      variant="solid"
                      onClick={handleSaveProfile}
                      loading={isLoading}
                    >
                      Save
                    </Button>
                  </CardActions>
                </CardOverflow>
              </Card>
              <Card>
                <Box sx={{ mb: 1 }}>
                  <Typography level="title-md">Bio</Typography>
                  <Typography level="body-sm">
                    Write a short introduction to be displayed on your profile
                  </Typography>
                </Box>
                <Divider />
                <Stack spacing={2} sx={{ my: 1 }}>
                  <EditorToolbar />
                  <Textarea
                    size="sm"
                    minRows={4}
                    sx={{ mt: 1.5 }}
                    placeholder='Write a short introduction to be displayed on your profile'
                    value={formData.about_me}
                    onChange={(e) => handleInputChange('about_me', e.target.value)}
                  />
                  <FormHelperText sx={{ mt: 0.75, fontSize: 'xs' }}>
                    {275 - formData.about_me.length} characters left
                  </FormHelperText>
                </Stack>
                <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                  <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                    <Button size="sm" variant="outlined" color="neutral">
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      variant="solid"
                      onClick={handleSaveProfile}
                      loading={isLoading}
                    >
                      Save
                    </Button>
                  </CardActions>
                </CardOverflow>
              </Card>
            </>
          ) : (
            <>
              {/* Services Section */}
              <Card>
                <Box sx={{ mb: 1 }}>
                  <Typography level="title-md">Services</Typography>
                  <Typography level="body-sm">
                    Add and manage the services you offer
                  </Typography>
                </Box>
                <Divider />
                <Stack spacing={3} sx={{ my: 2 }}>
                  {services.map((service, index) => (
                    <div key={index}>
                      {index > 0 && <Divider sx={{ my: 2 }} />}
                      <Stack spacing={2}>
                        <FormControl>
                          <FormLabel>Service Name</FormLabel>
                          <Input
                            size="sm"
                            value={service.name}
                            onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                            placeholder="e.g., Consultation"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            size="sm"
                            minRows={2}
                            value={service.description}
                            onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                            placeholder="Describe the service"
                          />
                        </FormControl>
                        <Stack direction="row" spacing={2}>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <Input
                              size="sm"
                              type="number"
                              value={service.duration}
                              onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                              placeholder="e.g., 60"
                            />
                          </FormControl>
                          <FormControl sx={{ flex: 1 }}>
                            <FormLabel>Price</FormLabel>
                            <Input
                              size="sm"
                              type="number"
                              value={service.price}
                              onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                              placeholder="e.g., 100"
                              startDecorator={
                                <Select 
                                  value={service.currency || 'INR'}
                                  onChange={(_, value) => handleServiceChange(index, 'currency', value as string)}
                                  sx={{ width: '80px' }}
                                >
                                  <Option value="INR">₹</Option>
                                  <Option value="USD">$</Option>
                                  <Option value="EUR">€</Option>
                                </Select>
                              }
                            />
                          </FormControl>
                        </Stack>
                        {services.length > 1 && (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              size="sm"
                              variant="soft"
                              color="danger"
                              startDecorator={<DeleteIcon />}
                              onClick={() => handleRemoveService(index)}
                            >
                              Remove Service
                            </Button>
                          </Box>
                        )}
                      </Stack>
                    </div>
                  ))}
                  <Button
                    variant="outlined"
                    color="neutral"
                    onClick={handleAddService}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Another Service
                  </Button>
                </Stack>
                <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                  <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                    <Button size="sm" variant="outlined" color="neutral">
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      variant="solid"
                      onClick={handleSaveServices}
                      loading={isLoading}
                    >
                      Save Services
                    </Button>
                  </CardActions>
                </CardOverflow>
              </Card>

              {/* Availability Section */}
              <Card>
                <Box sx={{ mb: 1 }}>
                  <Typography level="title-md">Availability</Typography>
                  <Typography level="body-sm">
                    Set your weekly availability for appointments
                  </Typography>
                </Box>
                <Divider />
                <Stack spacing={3} sx={{ my: 2 }}>
                  {availability.map((day, dayIndex) => (
                    <div key={dayIndex}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <FormControl sx={{ flex: 1 }}>
                          <FormLabel>Day</FormLabel>
                          <Select
                            size="sm"
                            value={day.day}
                            onChange={(_, value) => handleDayChange(dayIndex, value)}
                          >
                            <Option value="Monday">Monday</Option>
                            <Option value="Tuesday">Tuesday</Option>
                            <Option value="Wednesday">Wednesday</Option>
                            <Option value="Thursday">Thursday</Option>
                            <Option value="Friday">Friday</Option>
                            <Option value="Saturday">Saturday</Option>
                            <Option value="Sunday">Sunday</Option>
                            <Option value="Weekdays">Weekdays (Mon-Fri)</Option>
                            <Option value="Weekends">Weekends (Sat-Sun)</Option>
                          </Select>
                        </FormControl>
                        {availability.length > 1 && (
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            onClick={() => handleRemoveDay(dayIndex)}
                            sx={{ mt: 2 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>
                      <Stack spacing={1}>
                        {day.times.map((time, timeIndex) => (
                          <Stack key={timeIndex} direction="row" spacing={1} alignItems="center">
                            <FormControl sx={{ flex: 1 }}>
                              <FormLabel>Time Slot</FormLabel>
                              <Input
                                size="sm"
                                value={time}
                                onChange={(e) => handleAvailabilityTimeChange(dayIndex, timeIndex, e.target.value)}
                                placeholder="HH:MM-HH:MM"
                                startDecorator={<AccessTimeFilledRoundedIcon />}
                              />
                            </FormControl>
                            {day.times.length > 1 && (
                              <IconButton
                                size="sm"
                                variant="soft"
                                color="danger"
                                onClick={() => handleRemoveAvailabilityTime(dayIndex, timeIndex)}
                                sx={{ mt: 2 }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Stack>
                        ))}
                        <Button
                          size="sm"
                          variant="soft"
                          onClick={() => handleAddAvailabilityTime(dayIndex)}
                          sx={{ alignSelf: 'flex-start' }}
                          startDecorator={<EditRoundedIcon />}
                        >
                          Add Time Slot
                        </Button>
                      </Stack>
                      {dayIndex < availability.length - 1 && <Divider sx={{ my: 2 }} />}
                    </div>
                  ))}
                  <Button
                    variant="outlined"
                    color="neutral"
                    onClick={handleAddDay}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Another Day
                  </Button>
                </Stack>
                <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                  <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                    <Button size="sm" variant="outlined" color="neutral">
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      variant="solid"
                      onClick={handleSaveAvailability}
                      loading={isLoading}
                    >
                      Save Availability
                    </Button>
                  </CardActions>
                </CardOverflow>
              </Card>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}