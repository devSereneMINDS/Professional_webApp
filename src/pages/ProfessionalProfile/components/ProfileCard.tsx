import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Divider from '@mui/joy/Divider';
import Stack from '@mui/joy/Stack';
import Chip from '@mui/joy/Chip';
import { useState } from 'react';
import Textarea from '@mui/joy/Textarea';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';

interface ClientQnA {
  'age-group': string;
  occupation: string;
  'marital-status': string;
}

interface ClientData {
  id: number;
  name: string;
  age: number | null;
  email: string;
  sex: string | null;
  phone_no: string;
  diagnosis: string | null;
  photo_url: string;
  zipcode: string | null;
  city: string | null;
  appointment_id: number | null;
  assessment_id: number | null;
  invoice_id: number | null;
  medical_record_id: number | null;
  created_at: string;
  updated_at: string;
  q_and_a: ClientQnA;
  uid: string;
  no_of_sessions: number;
}

interface ClientProfileProps {
  clientData: ClientData;
}

export default functionClientProfile({ clientData }: ClientProfileProps) {
  // Mock data - in a real app, this would come from props or state
  const client = {
    name: "Noya Thera",
    email: "yatolightyagami@gmail.com",
    gender: "Not Available",
    ageGroup: "Not Available",
    maritalStatus: "Not Available",
    occupation: "Not Available",
  };

  const [notes, setNotes] = useState("");
  const [isNotesEditable, setIsNotesEditable] = useState(false);
  interface Appointment {
    date: string;
    time: string;
    message: string;
  }

  const [upcomingAppointments] = useState<Appointment[]>([
    { date: "20/05/2025", time: "4:38:00 AM", message: "daf" }
  ]);
  const [completedAppointments] = useState<Appointment[]>([]);

  const toggleNotesEdit = () => {
    setIsNotesEditable(!isNotesEditable);
  };

  const saveNotes = () => {
    // In a real app, you would save to an API here
    console.log("Notes saved:", notes);
    setIsNotesEditable(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap'
      }}
    >
      {/* Left Section - Client Info */}
      <Card sx={{ flex: 1, minWidth: 300 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <AspectRatio ratio="1" sx={{ width: 100, borderRadius: 'sm' }}>
              <img
                src={clientData.photo_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286}
                alt={`${clientData.name}'s profile`}
              />
            </AspectRatio>
            <Box>
              <Typography level="h4">{clientData.name}</Typography>
              <Typography level="body-sm">{clientData.email}</Typography>
              <Button 
                variant="outlined" 
                size="sm" 
                sx={{ mt: 1 }}
              >
                Add to Chat
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Box>
              <Typography level="body-xs" textColor="text.tertiary">Gender</Typography>
              <Typography>{clientData.q_and_a.gender || 'Not Available'}</Typography>
            </Box>

            <Box>
              <Typography level="body-xs" textColor="text.tertiary">Age Group</Typography>
              <Typography>{clientData.q_and_a['age-group'] || 'Not Available'}</Typography>
            </Box>

            <Box>
              <Typography level="body-xs" textColor="text.tertiary">Marital Status</Typography>
              <Typography>{clientData.q_and_a['marital-status'] || 'Not Available'}</Typography>
            </Box>

            <Box>
              <Typography level="body-xs" textColor="text.tertiary">Occupation</Typography>
              <Typography>{clientData.q_and_a.occupation || 'Not Available'}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Right Section - Appointments and Notes */}
      <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Appointments Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography level="title-md">Appointments</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip variant="soft" color="neutral">
                  Past
                </Chip>
                <Chip variant="solid" color="primary">
                  Upcoming
                </Chip>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Upcoming Appointments */}
            <Box sx={{ mb: 3 }}>
              <Typography level="title-sm" sx={{ mb: 1 }}>Upcoming</Typography>
              {upcomingAppointments.length > 0 ? (
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'sm' }}>
                  {upcomingAppointments.map((appt, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>
                        {appt.date} | {appt.time}
                      </Typography>
                      <Typography>{appt.message}</Typography>
                    </Box>
                  ))}
                </Sheet>
              ) : (
                <Typography level="body-sm" textColor="text.tertiary">No upcoming appointments</Typography>
              )}
            </Box>

            {/* Completed Appointments */}
            <Box>
              <Typography level="title-sm" sx={{ mb: 1 }}>Completed</Typography>
              {completedAppointments.length > 0 ? (
                <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'sm' }}>
                  {completedAppointments.map((appt, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>
                        {appt.date} | {appt.time}
                      </Typography>
                      <Typography>{appt.message}</Typography>
                    </Box>
                  ))}
                </Sheet>
              ) : (
                <Typography level="body-sm" textColor="text.tertiary">No completed appointments</Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Mental Health Assessment */}
        <Card>
          <CardContent>
            <Typography level="title-md" sx={{ mb: 1 }}>Mental Health Assessment</Typography>
            <Typography level="body-sm" textColor="text.tertiary">No data available</Typography>
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography level="title-md">Notes</Typography>
              {isNotesEditable ? (
                <Button
                  size="sm"
                  startDecorator={<SaveIcon />}
                  onClick={saveNotes}
                >
                  Save
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outlined"
                  startDecorator={<EditNoteIcon />}
                  onClick={toggleNotesEdit}
                >
                  Edit
                </Button>
              )}
            </Box>
            
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about the client..."
              minRows={4}
              readOnly={!isNotesEditable}
              variant={isNotesEditable ? "outlined" : "plain"}
              sx={{
                '& textarea': {
                  cursor: isNotesEditable ? 'text' : 'pointer',
                }
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
