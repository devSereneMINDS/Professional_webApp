import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Avatar from '@mui/material/Avatar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const steps = [
  'Basic Details',
  'OTP Verification',
  'Document Upload',
  'Complete'
];

const AvatarWithEdit = ({ src, onChange }: { src: string | null, onChange: (file: File) => void }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={src || undefined}
        sx={{ width: 100, height: 100 }}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          borderRadius: '100%',
          backgroundColor: 'background.paper',
        }}
        onClick={handleClick}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        hidden
      />
    </Box>
  );
};

const BasicDetailsForm = ({ 
  handleNext,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  dob,
  setDob,
  phone,
  setPhone,
  avatar,
  setAvatar
}: { 
  handleNext: () => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  dob: Date | null;
  setDob: (value: Date | null) => void;
  phone: string;
  setPhone: (value: string) => void;
  avatar: string | null;
  setAvatar: (value: string | null) => void;
}) => {
  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        setAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" textAlign="center">
        Please provide your basic details
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <AvatarWithEdit src={avatar} onChange={handleAvatarChange} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          required
        />
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date of Birth"
          value={dob}
          onChange={(newValue) => setDob(newValue)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              fullWidth 
              required 
            />
          )}
        />
      </LocalizationProvider>
      <TextField
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        required
      />
      <Button 
        variant="contained" 
        onClick={handleNext} 
        fullWidth
        disabled={!firstName || !lastName || !dob || !phone}
      >
        Next
      </Button>
    </Box>
  );
};

const OtpVerificationForm = ({ 
  handleNext, 
  handleBack,
  phone
}: { 
  handleNext: () => void, 
  handleBack: () => void,
  phone: string
}) => {
  const [otp, setOtp] = React.useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" textAlign="center">
        OTP Verification
      </Typography>
      <Typography variant="body1" textAlign="center">
        We've sent a 6-digit OTP to {phone}
      </Typography>
      <TextField
        label="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        fullWidth
        required
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={handleBack} fullWidth>
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={handleNext} 
          fullWidth
          disabled={otp.length !== 6}
        >
          Verify
        </Button>
      </Box>
    </Box>
  );
};

const DocumentUploadForm = ({ 
  handleNext, 
  handleBack,
  document,
  setDocument
}: { 
  handleNext: () => void, 
  handleBack: () => void,
  document: File | null,
  setDocument: (file: File | null) => void
}) => {
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" textAlign="center">
        Document Verification
      </Typography>
      <Typography variant="body1">
        Please upload a government-issued ID (Passport, Driver's License, etc.)
      </Typography>
      <Button variant="outlined" component="label" fullWidth>
        {document ? document.name : 'Upload Document'}
        <input type="file" hidden onChange={handleDocumentChange} />
      </Button>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={handleBack} fullWidth>
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={handleNext} 
          fullWidth
          disabled={!document}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

const CompletionStep = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 3,
      textAlign: 'center'
    }}>
      <Typography variant="h5" color="primary">
        Thank you for completing the onboarding process!
      </Typography>
      <Typography variant="body1">
        Your account is now being verified. We'll notify you once the verification is complete.
      </Typography>
      <Button 
        variant="contained" 
        href="/dashboard" 
        fullWidth
        sx={{ mt: 2 }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default function OnboardingStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [dob, setDob] = React.useState<Date | null>(null);
  const [phone, setPhone] = React.useState('');
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [document, setDocument] = React.useState<File | null>(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicDetailsForm
            handleNext={handleNext}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            dob={dob}
            setDob={setDob}
            phone={phone}
            setPhone={setPhone}
            avatar={avatar}
            setAvatar={setAvatar}
          />
        );
      case 1:
        return (
          <OtpVerificationForm
            handleNext={handleNext}
            handleBack={handleBack}
            phone={phone}
          />
        );
      case 2:
        return (
          <DocumentUploadForm
            handleNext={handleNext}
            handleBack={handleBack}
            document={document}
            setDocument={setDocument}
          />
        );
      case 3:
        return <CompletionStep />;
      default:
        return null;
    }
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
      >
        Onboaring
      </Typography>
      
      <Box sx={{ width: '100%', my: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {renderStepContent(activeStep)}
    </Card>
  );
}