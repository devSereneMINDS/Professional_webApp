import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import { steps } from './types';
import { BasicDetailsForm } from './BasicDetailsForm';
import { OtpVerificationForm } from './OtpVerificationForm';
import { DocumentUploadForm } from './DocumentUploadForm';
import { CompletionStep } from './CompletionStep';
import { useSelector } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(2), // Reduced from 4 for mobile
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
    padding: theme.spacing(4), // Original padding for larger screens
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

export const OnboardingStepper: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isVerySmallScreen = useMediaQuery('(max-height: 600px)');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const [activeStep, setActiveStep] = React.useState(0);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [dob, setDob] = React.useState<Date | null>(null);
  const [phone, setPhone] = React.useState('');
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [document, setDocument] = React.useState<File | null>(null);
  const [areaOfExpertise, setAreaOfExpertise] = React.useState('');
  const [qAndA, setQAndA] = React.useState<Record<string, string>>({});

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    const fullName = `${firstName} ${lastName}`;
    const dateOfBirth = dob?.toISOString().split('T')[0] || '';
    
    const data = {
      full_name: fullName,
      phone: phone,
      date_of_birth: dateOfBirth,
      email: email,
      photo_url: avatar,
      proof_document: document,
      area_of_expertise: areaOfExpertise, 
      q_and_a: qAndA,
    };

    console.log("Data to be submitted:", data);

    try {
      const response = await fetch(`${API_BASE_URL}/professionals/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Professional created successfully", result);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        const error = await response.json();
        console.error("Error creating professional:", error);
      }
    } catch (error) {
      console.error("Error in API call:", error);
    }
  };

  interface RootState {
    professional?: {
      professionalEmail?: string;
    };
  }

  const email = useSelector((state: RootState) => state.professional?.professionalEmail);
  console.log('Email from Redux:', email);
  if (!email) {
    window.location.href = '/login';
    return null;
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BasicDetailsForm
            handleNext={handleNext}
            firstName={firstName}
            setFirstName={setFirstName}
            email={email}
            lastName={lastName}
            setLastName={setLastName}
            dob={dob}
            setDob={setDob}
            phone={phone}
            setPhone={setPhone}
            handlePhoneChange={(newPhone) => setPhone(newPhone)}
            avatar={avatar}
            setAvatar={setAvatar}
            domain={areaOfExpertise}
            setDomain={setAreaOfExpertise}
          />
        );
      case 1:
        return (
          <OtpVerificationForm
            handleNext={handleNext}
            handleBack={handleBack}
            phone={phone}
            email={email}
            
          />
        );
      case 2:
        return (
          <DocumentUploadForm
            handleNext={handleNext}
            handleBack={handleBack}
            document={document}
            setDocument={setDocument}
            qAndA={qAndA}
            setQAndA={setQAndA}
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
      <Box sx={{ 
        width: '100%', 
        my: isVerySmallScreen ? 1 : 2, // Adjust margin for very small screens
        overflow: isSmallScreen ? 'auto' : 'visible' // Enable scrolling for stepper on small screens
      }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          orientation={isSmallScreen ? 'horizontal' : 'horizontal'} // Vertical on small screens
          sx={{
            '& .MuiStepLabel-label': {
              fontSize: isSmallScreen ? '0.75rem' : '0.875rem', // Smaller text on mobile
            },
            '& .MuiStepConnector-root': {
              marginLeft: isSmallScreen ? '12px' : '0', // Adjust for vertical stepper
            }
          }}
        >
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
};