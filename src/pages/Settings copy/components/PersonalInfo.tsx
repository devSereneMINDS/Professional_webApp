import * as React from 'react';
import { 
  Card, CardActions, CardOverflow, Divider, FormLabel, 
  Input, Stack, Typography, Box, IconButton, AspectRatio, Select, Option, 
  Chip, ListItemDecorator, Checkbox
} from '@mui/joy';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneIcon from '@mui/icons-material/Phone';
import Button from '@mui/joy/Button';
import CountrySelector from './ContrySelector';
import { FormData } from './type';
// import { supabase } from '../../../../supabaseClient';

interface PersonalInfoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  professional: { data: { photo_url: string } } | null;
  isLoading: boolean;
  onSave: (e?: React.FormEvent) => void;
}

export default function PersonalInfo({ formData, setFormData, professional, isLoading, onSave }: PersonalInfoProps) {
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
//  const [avatarPreview, setAvatarPreview] = React.useState<string>(professional?.data?.photo_url || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
 const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  // const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     // Create temporary preview
  //     const previewUrl = URL.createObjectURL(file);
  //     setAvatarPreview(previewUrl);

  //     // Upload to Supabase
  //     const fileName = `${Date.now()}-${file.name}`;
  //     const { error: uploadError } = await supabase.storage
  //       .from('professional_profilepic')
  //       .upload(fileName, file);

  //     if (uploadError) throw uploadError;

  //     // Get permanent URL
  //     const { data: { publicUrl } } = supabase.storage
  //       .from('professional_profilepic')
  //       .getPublicUrl(fileName);

  //     // Update preview with permanent URL
  //     setAvatarPreview(publicUrl);
      
  //     // Update form data with new photo URL
  //     setFormData(prev => ({
  //       ...prev,
  //       photo_url: publicUrl
  //     }));

  //   } catch (error) {
  //     console.error('Error uploading avatar:', error);
  //     // Reset to original if error occurs
  //     setAvatarPreview(professional?.data?.photo_url || '');
  //   } finally {
  //     // Reset file input
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = '';
  //     }
  //   }
  // };

  const handleLanguageChange = (_event: React.SyntheticEvent | null, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      languages: newValue
    }));
  };

  const languages = [
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Bengali', label: 'Bengali' },
    { value: 'Telugu', label: 'Telugu' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Urdu', label: 'Urdu' },
    { value: 'Gujarati', label: 'Gujarati' },
    { value: 'Kannada', label: 'Kannada' },
    { value: 'Odia', label: 'Odia' },
    { value: 'Malayalam', label: 'Malayalam' },
    { value: 'Punjabi', label: 'Punjabi' },
    { value: 'Assamese', label: 'Assamese' },
    { value: 'Maithili', label: 'Maithili' },
    { value: 'Sindhi', label: 'Sindhi' },
    { value: 'English', label: 'English' },
    { value: 'Mandarin Chinese', label: 'Mandarin Chinese' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'Russian', label: 'Russian' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'German', label: 'German' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Korean', label: 'Korean' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Turkish', label: 'Turkish' },
    { value: 'Dutch', label: 'Dutch' },
    { value: 'Vietnamese', label: 'Vietnamese' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Persian (Farsi)', label: 'Persian (Farsi)' },
    { value: 'Malay/Indonesian', label: 'Malay/Indonesian' },
    { value: 'Swahili', label: 'Swahili' },
    { value: 'Polish', label: 'Polish' },
    { value: 'Ukrainian', label: 'Ukrainian' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(e);
  };

  return (
    <Card component="form" onSubmit={handleSubmit}>
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
            onClick={handleAvatarUploadClick}
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
            <Input 
              size="sm" 
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Enter your full name"
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Stack spacing={1} sx={{ flex: 1 }}>
  <FormLabel>Area of Expertise</FormLabel>
  <Select
    size="sm"
    value={formData.area_of_expertise}
    sx={{
      // Selected value (displayed in the input)
      '--Select-defaultTypography-fontWeight': '400',
      // Dropdown options
      '& [role="option"]': {
        fontWeight: 400,
      },
    }}
    onChange={(_e, newValue) => handleInputChange('area_of_expertise', newValue || '')}
    placeholder="Select your area of expertise"
  >
    <Option value="Counseling Psychologist">Counseling Psychologist</Option>
    <Option value="Clinical Psychologist">Clinical Psychologist</Option>
    <Option value="Wellness Buddy">Wellness Buddy</Option>
  </Select>
</Stack>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel>Email</FormLabel>
              <Input
                size="sm"
                type="email"
                startDecorator={<EmailRoundedIcon />}
                placeholder="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Stack>
          </Stack>
          <Stack spacing={1}>
            <CountrySelector 
              value={formData.country}
              onChange={(countryName) => {
                setFormData(prev => ({
                  ...prev,
                  country: countryName
                }));
              }}
            />
          </Stack>
          <Stack spacing={1}>
            <FormLabel>Languages</FormLabel>
            <Select
              multiple
              size="sm"
              value={formData.languages || []}
              onChange={handleLanguageChange}
              placeholder="Select languages"
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {selected.map((selectedOption) => (
                    <Chip
                      key={selectedOption.value}
                      variant="soft"
                      color="primary"
                    >
                      {selectedOption.label}
                    </Chip>
                  ))}
                </Box>
              )}
              sx={{
                minWidth: '15rem',
              }}
              slotProps={{
                listbox: {
                  sx: {
                    width: '100%',
                  },
                },
              }}
            >
              {languages.map((lang) => (
                <Option key={lang.value} value={lang.value}>
                  <ListItemDecorator>
                    <Checkbox
                      checked={formData.languages?.includes(lang.value) || false}
                      sx={{ pointerEvents: 'none' }}
                    />
                  </ListItemDecorator>
                  {lang.label}
                </Option>
              ))}
            </Select>
          </Stack>
          <Stack spacing={1}>
            <FormLabel>Phone</FormLabel>
            <Input
              size="sm"
              type="tel"
              startDecorator={<PhoneIcon />}
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </Stack>
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
            <Input 
              size="sm" 
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Enter your full name"
            />
          </Stack>
        </Stack>
        <Stack spacing={1}>
          <FormLabel>Area of expertise</FormLabel>
          <Input 
            size="sm" 
            value={formData.area_of_expertise}
            onChange={(e) => handleInputChange('area_of_expertise', e.target.value)}
            placeholder="Enter your area of expertise"
          />
        </Stack>
        <Stack spacing={1}>
          <FormLabel>Email</FormLabel>
          <Input
            size="sm"
            type="email"
            startDecorator={<EmailRoundedIcon />}
            placeholder="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </Stack>
        <Stack spacing={1}>
          <FormLabel>Country</FormLabel>
          <CountrySelector 
            value={formData.country}
            onChange={(newCountryCode) => {
              setFormData(prev => ({
                ...prev,
                country: newCountryCode
              }));
            }}
          />
        </Stack>
        <Stack spacing={1}>
          <FormLabel>Languages</FormLabel>
          <Select
            multiple
            size="sm"
            value={formData.languages || []}
            onChange={handleLanguageChange}
            placeholder="Select languages"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {selected.map((selectedOption) => (
                  <Chip
                    key={selectedOption.value}
                    variant="soft"
                    color="primary"
                  >
                    {selectedOption.label}
                  </Chip>
                ))}
              </Box>
            )}
          >
            {languages.map((lang) => (
              <Option key={lang.value} value={lang.value}>
                <ListItemDecorator>
                  <Checkbox
                    checked={formData.languages?.includes(lang.value) || false}
                    sx={{ pointerEvents: 'none' }}
                  />
                </ListItemDecorator>
                {lang.label}
              </Option>
            ))}
          </Select>
        </Stack>
        <Stack spacing={1}>
          <FormLabel>Phone</FormLabel>
          <Input
            size="sm"
            type="tel"
            startDecorator={<PhoneIcon />}
            placeholder="Phone number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </Stack>
      </Stack>
      <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
          <Button size="sm" variant="outlined" color="neutral" type="button">
            Cancel
          </Button>
          <Button 
            size="sm" 
            variant="solid"
            type="submit"
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