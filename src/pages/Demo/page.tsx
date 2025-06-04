import { useState } from 'react';
import Button from '@mui/joy/Button';
import Toastbar from '../../components/ToastBar'; // Corrected import

type ToastType = 'success' | 'error' | 'info';

const ExamplePage = () => {
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: ToastType;
  }>({
    open: false,
    message: '',
    type: 'success',
  });

  const triggerToast = (message: string, type: ToastType) => {
    setToast({ open: true, message, type });
  };

  const handleClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <div style={{ padding: 16 }}>
      <Button onClick={() => triggerToast('Saved successfully!', 'success')} color="success">
        Show Success
      </Button>
      <Button onClick={() => triggerToast('Failed to save.', 'error')} color="danger" sx={{ ml: 2 }}>
        Show Error
      </Button>
      <Button onClick={() => triggerToast('This is some neutral info.', 'info')} color="neutral" sx={{ ml: 2 }}>
        Show Info
      </Button>

      <Toastbar
        open={toast.open}
        onClose={handleClose}
        prompt={toast.message}
        success={toast.type === 'success'}
        neutral={toast.type === 'info'}
      />
    </div>
  );
};

export default ExamplePage;
