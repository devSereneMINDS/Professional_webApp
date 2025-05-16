import * as React from 'react';
import { Card, CardActions, CardOverflow, Divider, FormControl, FormLabel, Input, Stack, Typography, Box, Button } from '@mui/joy';
import Textarea from '@mui/joy/Textarea';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormData } from './type';

interface EducationSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isLoading: boolean;
  onSave: () => void;
}

export default function EducationSection({ formData, setFormData, isLoading, onSave }: EducationSectionProps) {
  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institute: '', degree: '', description: '' }]
    }));
  };

  // const handleEducationChange = (index: number, field: keyof FormData['education'][0], value: string) => {
  //   const updatedEducation = [...formData.education];
  //   updatedEducation[index][field] = value;
  //   setFormData(prev => ({
  //     ...prev,
  //     education: updatedEducation
  //   }));
  // };

    const handleEducationChange = (index: number, field: keyof FormData['education'][0], value: string) => {
      setFormData(prev => {
        const updatedEducation = prev.education.map((edu, i) =>
          i === index ? { ...edu, [field]: value } : edu
        );
        return { ...prev, education: updatedEducation };
      });
    };

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">Education</Typography>
        <Typography level="body-sm">
          Add your educational qualifications and background
        </Typography>
      </Box>
      <Divider />
      <Stack spacing={3} sx={{ my: 2 }}>
        {formData.education.map((edu, index) => (
          <div key={index}>
            {index > 0 && <Divider sx={{ my: 2 }} />}
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Institute Name</FormLabel>
                <Input
                  size="sm"
                  value={edu.institute}
                  onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
                  placeholder="e.g., University of California"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Degree</FormLabel>
                <Input
                  size="sm"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  size="sm"
                  minRows={2}
                  value={edu.description}
                  onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                  placeholder="Describe your education, achievements, or specializations"
                />
              </FormControl>
              {formData.education.length > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    startDecorator={<DeleteIcon />}
                    onClick={() => handleRemoveEducation(index)}
                  >
                    Remove Education
                  </Button>
                </Box>
              )}
            </Stack>
          </div>
        ))}
        <Button
          variant="outlined"
          color="neutral"
          onClick={handleAddEducation}
          startDecorator={<AddIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Add Education
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
            Save Education
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}
