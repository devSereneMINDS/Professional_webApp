import * as React from 'react';
import { Modal, ModalDialog, ModalClose, Typography, List, ListItem, Link } from '@mui/joy';
import { EventModalData } from '../types';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  modalData: EventModalData | null;
}

export const EventModal: React.FC<EventModalProps> = ({ open, onClose, modalData }) => {
  if (!modalData) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        aria-labelledby="event-modal"
        sx={{
          maxWidth: 400,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <ModalClose />
        <Typography level="h4" component="h2" mb={2}>
          {modalData.title}
        </Typography>
        <Typography level="body-sm" mb={1}>
          <strong>Start:</strong> {modalData.start}
        </Typography>
        <Typography level="body-sm" mb={2}>
          <strong>End:</strong> {modalData.end}
        </Typography>
        
        {modalData.meetLink && (
          <Link
            href={modalData.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            mb={2}
          >
            Join Meet
          </Link>
        )}

        {modalData.guests && modalData.guests.length > 0 && (
          <>
            <Typography level="body-sm" fontWeight="lg" mt={2}>
              Guests:
            </Typography>
            <List size="sm">
              {modalData.guests.map((email) => (
                <ListItem key={email}>
                  <Link href={`mailto:${email}`} underline="hover">
                    {email}
                  </Link>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </ModalDialog>
    </Modal>
  );
};