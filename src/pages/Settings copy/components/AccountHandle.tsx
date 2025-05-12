import * as React from 'react';
import { 
  Card, CardActions, CardOverflow, Divider, FormControl, 
  FormLabel, Input, Stack, Typography, Box, Button 
} from '@mui/joy';
import { AccountLinks, FormData } from './type';


interface AccountsSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isLoading: boolean;
  onSave: () => void;
}

export default function AccountsSection({ formData, setFormData, isLoading, onSave }: AccountsSectionProps) {
  const handleAccountChange = (field: keyof AccountLinks, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">Social Accounts</Typography>
        <Typography level="body-sm">
          Add your social media profiles to help clients connect with you
        </Typography>
      </Box>
      <Divider />
      <Stack spacing={2} sx={{ my: 2 }}>
        <FormControl>
          <FormLabel>Instagram Profile</FormLabel>
          <Input
            size="sm"
            value={formData.instagram}
            onChange={(e) => handleAccountChange('instagram', e.target.value)}
            placeholder="https://instagram.com/yourusername"
            type="url"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Facebook Profile</FormLabel>
          <Input
            size="sm"
            value={formData.facebook}
            onChange={(e) => handleAccountChange('facebook', e.target.value)}
            placeholder="https://facebook.com/yourusername"
            type="url"
          />
        </FormControl>
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
            Save Accounts
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}