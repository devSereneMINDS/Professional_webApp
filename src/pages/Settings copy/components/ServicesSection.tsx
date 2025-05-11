import * as React from 'react';
import { Card, CardActions, CardOverflow, Divider, FormControl, FormLabel, Input, Stack, Typography, Box, Button } from '@mui/joy';
import Textarea from '@mui/joy/Textarea';
import DeleteIcon from '@mui/icons-material/Delete';
import { Service } from './type';

interface ServicesSectionProps {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  isLoading: boolean;
  onSave: () => void;
}

export default function ServicesSection({ services, setServices, isLoading, onSave }: ServicesSectionProps) {
  const handleAddService = () => {
    setServices([...services, { name: '', description: '', duration: '', price: ''}]);
  };

  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    setServices(updatedServices);
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">Services</Typography>
        <Typography level="body-sm">
          Add and manage the services you offer
        </Typography>
      </Box>
      <Divider />
      <Stack spacing={3} sx={{ my: 2 }}>
        {services.map((service, index) => (
          <div key={index}>
            {index > 0 && <Divider sx={{ my: 2 }} />}
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Service Name</FormLabel>
                <Input
                  size="sm"
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                  placeholder="e.g., Consultation"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  size="sm"
                  minRows={2}
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                  placeholder="Describe the service"
                />
              </FormControl>
              <Stack direction="row" spacing={2}>
                <FormControl sx={{ flex: 1 }}>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <Input
                    size="sm"
                    type="number"
                    value={service.duration}
                    onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                    placeholder="e.g., 60"
                  />
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <FormLabel>Price</FormLabel>
                  <Input
                    size="sm"
                    type="number"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                    placeholder="e.g., 100"
                  />
                </FormControl>
              </Stack>
              {services.length > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    size="sm"
                    variant="soft"
                    color="danger"
                    startDecorator={<DeleteIcon />}
                    onClick={() => handleRemoveService(index)}
                  >
                    Remove Service
                  </Button>
                </Box>
              )}
            </Stack>
          </div>
        ))}
        <Button
          variant="outlined"
          color="neutral"
          onClick={handleAddService}
          sx={{ alignSelf: 'flex-start' }}
        >
          Add Another Service
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
            Save Services
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}