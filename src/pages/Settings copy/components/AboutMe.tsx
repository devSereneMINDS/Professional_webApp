import * as React from 'react';
import { Card, CardActions, CardOverflow, Divider, FormHelperText, Stack, Typography, Box } from '@mui/joy';
import Button from '@mui/joy/Button';
import Textarea from '@mui/joy/Textarea';
import { FormData } from './type';

interface AboutMeProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isLoading: boolean;
  onSave: () => void;
}

export default function AboutMe({ formData, setFormData, isLoading, onSave }: AboutMeProps) {
  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      about_me: value
    }));
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">About me</Typography>
        <Typography level="body-sm">
          Write a short introduction to be displayed on your profile
        </Typography>
      </Box>
      <Divider />
      <Stack spacing={2} sx={{ my: 1 }}>
        <Textarea
          size="sm"
          minRows={4}
          sx={{ mt: 1.5 }}
          placeholder='Write a short introduction to be displayed on your profile'
          value={formData.about_me}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <FormHelperText sx={{ mt: 0.75, fontSize: 'xs' }}>
          {275 - formData.about_me.length} characters left
        </FormHelperText>
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