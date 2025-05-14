import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DocumentUploadFormProps } from './types';
import { supabase } from '../../../../supabaseClient.ts'; // Make sure you have supabase configured

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
      const { error } = await supabase.storage
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
        Upload Your Resume
      </Typography>
      <Typography variant="body1">
        Upload Carefully!! You may not able to change this in future.
      </Typography>
      <Button 
        variant="outlined" 
        component="label" 
        fullWidth
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : (document ? document.name : 'Click to upload your resume here')}
        <input 
          type="file" 
          hidden 
          onChange={handleDocumentUpload} 
          accept=".pdf" // Specify accepted file types
        />
      </Button>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={handleBack} fullWidth>
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          fullWidth
          sx = {{
            background: 'linear-gradient(rgba(2, 122, 242, 0.8), rgb(2, 107, 212))',
            color: '#fff',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.875rem',
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
          {isUploading ? 'Uploading...' : 'Submit'}
        </Button>
      </Box>
    </Box>
  );
};