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

export const OnboardingStepper: React.FC = () => {

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
      // If we're on the step before completion, submit the data
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
    const dateOfBirth = dob?.toISOString().split('T')[0] || ''; // Format as YYYY-MM-DD
    
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
        setActiveStep((prevActiveStep) => prevActiveStep + 1); // Move to completion step
      } else {
        const error = await response.json();
        console.error("Error creating professional:", error);
        // Handle error (maybe show to user)
      }
    } catch (error) {
      console.error("Error in API call:", error);
      // Handle error (maybe show to user)
    }
  };

  const email = useSelector((state: any) => state.professional?.professionalEmail);
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
};