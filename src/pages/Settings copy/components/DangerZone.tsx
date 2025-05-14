import * as React from 'react';
import { 
  Card, Divider, 
  Stack, Typography, Box, Button, Alert, Modal, ModalDialog 
} from '@mui/joy';
import { WarningRounded } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface DangerZoneProps {
  isLoading: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.sereneminds.life/api";

export function DangerZone({ isLoading }: DangerZoneProps) {

 interface RootState {
   professional?: {
     data?: {
       id?: string;
     };
   };
 }

 const navigate = useNavigate();

 const professionalId = useSelector((state: RootState) => state.professional?.data?.id);
  console.log(professionalId)

  const handleDeleteAccount = async () => {
    try {
      if(!professionalId){
        console.log("No professional id found")
        return
      }
      const response = await fetch(
        `${API_BASE_URL}/professionals/delete/${professionalId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Account successfully deleted");
        close();
        navigate("/login");
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };
  const [open, setOpen] = React.useState(false);

  return (
    <Card variant="outlined" color="danger">
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md" color="danger">Danger Zone</Typography>
        <Typography level="body-sm">
          Actions in this section are irreversible. Proceed with caution.
        </Typography>
      </Box>
      <Divider />
      <Stack spacing={2} sx={{ my: 2 }}>
        <Alert
          color="danger"
          variant="soft"
          startDecorator={<WarningRounded />}
        >
          Deleting your account will remove all your data permanently.
        </Alert>
        
        <Button
          color="danger"
          variant="solid"
          onClick={() => setOpen(true)}
          loading={isLoading}
          sx={{
            alignSelf: 'flex-start',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          Delete Account
        </Button>
      </Stack>

      {/* Confirmation Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Typography
            id="alert-dialog-title"
            level="h2"
            startDecorator={<WarningRounded color="error" />}
            sx={{ mb: 2 }}
          >
            Confirm Account Deletion
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography
            id="alert-dialog-description"
            level="body-md"
            sx={{ mb: 3 }}
          >
            Are you sure you want to delete your account? This action cannot be undone.
            All your data will be permanently removed.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={() => {
                handleDeleteAccount();
                setOpen(false);
              }}
              loading={isLoading}
            >
              Delete Account
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Card>
  );
}