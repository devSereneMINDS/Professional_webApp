import * as React from 'react';
import { 
  Card, CardActions, CardOverflow, Divider, FormControl, FormLabel, 
  Input, Stack, Typography, Box, IconButton, AspectRatio 
} from '@mui/joy';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneIcon from '@mui/icons-material/Phone';
import Button from '@mui/joy/Button';
import CountrySelector from './ContrySelector';
import { FormData } from './type';

interface PersonalInfoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  professional: { data: { photo_url: string } } | null;
  isLoading: boolean;
  onSave: () => void;
}

export default function PersonalInfo({ formData, setFormData, professional, isLoading, onSave }: PersonalInfoProps) {
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
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
    value={formData.country} // This should be the country name (e.g. "India")
    onChange={(countryName) => {
      setFormData(prev => ({
        ...prev,
        country: countryName // Store just the country name
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
    onChange={(newCountryCode) => {
      setFormData(prev => ({
        ...prev,
        country: newCountryCode
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
            onClick={onSave}
            loading={isLoading}
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
            }}
          >
            Save
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}