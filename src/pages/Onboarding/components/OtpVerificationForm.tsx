import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { OtpVerificationFormProps } from './types';
import OtpInput from 'react-otp-input';

export const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ 
  handleNext, 
  handleBack,
  phone,
  email
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      alert('Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log("Verifying OTP:", otp, "for phone:", phone);

      const response = await fetch(`${API_BASE_URL}/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp,email }),
      });

      if (response.ok) {
        alert("OTP verified successfully! Proceeding to next step.");
        handleNext(); // Proceed to next step
      } else {
        const errorData = await response.json();
        console.error("Error verifying OTP:", errorData);
        setError(errorData.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error in OTP verification API call:", error);
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (newValue: string) => {
    setOtp(newValue);
    // Clear error when user starts typing
    if (error) setError('');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" textAlign="center">
        OTP Verification
      </Typography>
      <Typography variant="body1" textAlign="center">
        We've sent a 4-digit OTP to {phone}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <OtpInput
          value={otp}
          onChange={handleChange}
          numInputs={4}
          renderInput={(props) => (
            <input
              {...props}
              style={{
                width: '45px',
                height: '45px',
                margin: '0 6px',
                fontSize: '20px',
                textAlign: 'center',
                border: error ? '1px solid #d32f2f' : '1px solid #ccc',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = error ? '#d32f2f' : '#7b3fe4';
                e.target.style.boxShadow = error 
                  ? '0 0 4px rgba(211, 47, 47, 0.4)' 
                  : '0 0 4px rgba(123, 63, 228, 0.4)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? '#d32f2f' : '#ccc';
                e.target.style.boxShadow = 'none';
              }}
            />
          )}
        />
      </Box>

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handleBack} 
          fullWidth
          disabled={isLoading}
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={handleVerifyOtp} 
          fullWidth
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>
      </Box>
    </Box>
  );
};