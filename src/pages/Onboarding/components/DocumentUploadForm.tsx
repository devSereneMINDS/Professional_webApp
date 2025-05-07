import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DocumentUploadFormProps } from './types';
import { supabase } from '../../../../supabaseClient.js'; // Make sure you have supabase configured

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ 
  handleNext, 
  handleBack,
  document,
  setDocument
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = React.useState('');

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setDocument(file); // Set the document in parent component

    const fileName = `${Date.now()}-${file.name}`;

    try {
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from("professional_docs")
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading document:", error.message);
        setIsUploading(false);
        return;
      }

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from("professional_docs")
        .getPublicUrl(fileName);

      console.log("File uploaded successfully:", publicUrl);
      setUploadedFileUrl(publicUrl);
    } catch (err) {
      console.error("Error during upload:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (uploadedFileUrl) {
      handleNext(); // Proceed to next step only if file is uploaded
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
      <Button 
        variant="outlined" 
        component="label" 
        fullWidth
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : (document ? document.name : 'Upload Document')}
        <input 
          type="file" 
          hidden 
          onChange={handleDocumentUpload} 
          accept=".pdf,.jpg,.jpeg,.png" // Specify accepted file types
        />
      </Button>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={handleBack} fullWidth>
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          fullWidth
        >
          {isUploading ? 'Uploading...' : 'Submit'}
        </Button>
      </Box>
    </Box>
  );
};