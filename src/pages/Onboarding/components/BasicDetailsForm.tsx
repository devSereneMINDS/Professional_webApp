import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MuiTelInput } from 'mui-tel-input';
import { AvatarWithEdit } from './AvatarWithEdit';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { supabase } from '../../../../supabaseClient.ts';
import { BasicDetailsFormProps } from './types.ts';
import { useDispatch } from 'react-redux';
import { updatePersonalDetails, uploadProfilePic } from '../../../store/slices/userSlice.js'; // Adjust import path


export const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({
  handleNext,
  firstName,
  setFirstName,
  email,
  lastName,
  setLastName,
  dob,
  setDob,
  phone,
  setPhone,
  avatar,
  setAvatar,
  domain,
  setDomain
}) => {
  const dispatch = useDispatch();
  const API_BASE_URL = "https://api.sereneminds.life/api";

  React.useEffect(() => {
    return () => {
      // Clean up object URLs when component unmounts
      if (avatar && typeof avatar === 'string' && avatar.startsWith('blob:')) {
        URL.revokeObjectURL(avatar);
      }
    };
  }, [avatar]);

  const handleAvatarChange = async (file: File) => {
    try {
      // Create temporary preview
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);
      dispatch(uploadProfilePic(previewUrl));

      // Upload to Supabase
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('professional_profilepic')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get permanent URL
      const { data: { publicUrl } } = supabase.storage
        .from('professional_profilepic')
        .getPublicUrl(fileName);

      // Update both local state and Redux with permanent URL
      setAvatar(publicUrl);
      dispatch(uploadProfilePic(publicUrl));
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setAvatar('');
      dispatch(uploadProfilePic(''));
    }
  };

  const handleDomainChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setDomain(value);
    updateReduxState();
  };

  const updateReduxState = () => {
    dispatch(updatePersonalDetails({
      fullName: `${firstName} ${lastName}`,
      area_of_expertise: domain,
      phone: phone,
      dateOfBirth: dob?.toISOString() || '',
      profilePic: avatar || undefined
    }));
  };
  

  const handleNextStep = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/otp/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email , phoneNumber : phone }),
      });
      
      if (!response.ok) {
        // Check if response is JSON before trying to parse it
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          console.error("Error generating OTP:", error);
        } else {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
        }
        throw new Error('OTP generation failed');
      }
      
      console.log("OTP Done");
      updateReduxState();
      handleNext();
    } catch (error) {
      console.error("Network or server error:", error);
      // Handle the error appropriately (show user message, etc.)
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600, mx: 'auto' }}>      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <AvatarWithEdit src={avatar || ''} onChange={handleAvatarChange} />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            updateReduxState();
          }}
          fullWidth
          required
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            updateReduxState();
          }}
          fullWidth
          required
        />
      </Box>

      <FormControl fullWidth required>
        <InputLabel id="domain-select-label">Professional Domain</InputLabel>
        <Select
          labelId="domain-select-label"
          value={domain}
          label="Professional Domain"
          onChange={handleDomainChange}
        >
          <MenuItem value="Clinical Psychologist">Clinical Psychologist</MenuItem>
          <MenuItem value="Counseling Psychologist">Counseling Psychologist</MenuItem>
        </Select>
      </FormControl>
      
      <MuiTelInput
        label="Phone Number"
        value={phone}
        onChange={(value) => {
          setPhone(value);
          updateReduxState();
        }}
        fullWidth
        required
      />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date of Birth"
          value={dob}
          onChange={(newValue) => {
            setDob(newValue);
            updateReduxState();
          }}
          slots={{ textField: (params) => <TextField {...params} fullWidth required /> }}
        />
      </LocalizationProvider>

      <Button
        variant="contained"
        size="large"
        onClick={handleNextStep}
        fullWidth
        sx={{ mt: 2 }}
      >
        Continue
      </Button>
    </Box>
  );
};