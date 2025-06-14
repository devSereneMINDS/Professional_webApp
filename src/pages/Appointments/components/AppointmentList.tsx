import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import AppointmentCard from './AppointmentCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/joy/Button';
import { RootState } from '../../../store/store';

const AppointmentList = () => {
  const navigate = useNavigate();

  const appointments = useSelector((state: RootState) => state.appointments);
  
  // Sort appointments
  const upcomingAppointments = appointments.upcoming
    ? [...appointments.upcoming].sort(
        (a, b) => new Date(a.appointment_time).getTime() - new Date(b.appointment_time).getTime()
      )
    : [];
  
  const completedAppointments = appointments.completed
    ? [...appointments.completed].sort(
        (a, b) => new Date(b.appointment_time).getTime() - new Date(a.appointment_time).getTime()
      )
    : [];

  const isLoading = !appointments.upcoming && !appointments.completed;

  const renderEmptyState = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '50vh',
      textAlign: 'center',
      gap: 2,
      width: '100%',
    }}>
      <img
        src="./assets/undraw_new-entries_xw4m-Photoroom.png"
        alt="No appointments"
        style={{ maxWidth: '300px' }}
      />
      <Typography component="h5">No appointments scheduled yet</Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        Start taking appointments by adding clients
      </Typography>
      <Button 
        onClick={() => navigate('/add-new-client')} 
        size="md" 
        color="primary"
      >
        Add Client
      </Button>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        justifyContent: 'center',
        p: 2 
      }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <AppointmentCard 
            key={index}
            id={index} 
            photoUrl={undefined} 
            meetLink={undefined} 
            isLoading 
          />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      flex: 1, 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Tabs defaultValue={0} sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        // Removed bgcolor to let parent theme dominate
      }}>
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            // Removed bgcolor to let parent theme dominate
            width: '100%',
            zIndex: 1,
            pt: 1,
            pb: 1
          }}
        >
          <TabList
            tabFlex={1}
            size="sm"
            sx={{
              pl: { xs: 0, md: 4 },
              justifyContent: 'left',
              [`&& .${tabClasses.root}`]: {
                fontWeight: '600',
                flex: 'initial',
                color: 'text.tertiary',
                [`&.${tabClasses.selected}`]: {
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  '&::after': {
                    height: '2px',
                    bgcolor: 'primary.500',
                  },
                },
              },
            }}
          >
            <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={0}>
              Upcoming
            </Tab>
            <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={1}>
              Completed
            </Tab>
          </TabList>
        </Box>

        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          pt: 2,
          pb: 2,
          // Removed bgcolor to let parent theme dominate
        }}>
          <TabPanel value={0} sx={{ width: '100%', p: 0 }}>
            {upcomingAppointments.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'flex-start',
                  minHeight: 'min-content',
                  p: 1
                }}
              >
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    name={
                      typeof appointment.client?.name === 'string' ? appointment.client.name :
                      typeof appointment.clientname === 'string' ? appointment.clientname :
                      'Unknown'
                    }
                    photoUrl={
                      typeof appointment.client?.photo_url === 'string' ? 
                      appointment.client.photo_url : 
                      undefined
                    }
                    date={new Date(appointment.appointment_time).toLocaleDateString()}
                    time={new Date(appointment.appointment_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    duration={appointment.duration || '00:30:00'}
                    contact={
                      typeof appointment.client?.phone_no === 'string' ? appointment.client.phone_no :
                      typeof appointment.clientphone === 'string' ? appointment.clientphone :
                      'N/A'
                    }
                    meetLink={typeof appointment.meet_link === 'string' ? appointment.meet_link : undefined}
                    message={typeof appointment.message === 'string' ? appointment.message : undefined}
                    professional={typeof appointment.professionalName === 'string' ? appointment.professionalName : undefined}
                    isUpcoming={true}
                  />
                ))}
              </Box>
            ) : renderEmptyState()}
          </TabPanel>

          <TabPanel value={1} sx={{ width: '100%', p: 0 }}>
            {completedAppointments.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'flex-start',
                  minHeight: 'min-content',
                  p: 1
                }}
              >
                {completedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    name={typeof appointment.client?.name === 'string' ? appointment.client.name : 
                          typeof appointment.clientname === 'string' ? appointment.clientname : 
                          'Unknown'}
                    photoUrl={appointment.client?.photo_url}
                    date={new Date(appointment.appointment_time).toLocaleDateString()}
                    time={new Date(appointment.appointment_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    duration={appointment.duration || '00:30:00'}
                    contact={String(appointment.client?.phone_no || appointment.clientphone || 'N/A')}
                    meetLink={appointment.meet_link ?? undefined}
                    message={appointment.message}
                    professional={typeof appointment.professionalName === 'string' ? appointment.professionalName : undefined}
                    isUpcoming={false}
                  />
                ))}
              </Box>
            ) : renderEmptyState()}
          </TabPanel>
        </Box>
      </Tabs>
    </Box>
  );
};

export default AppointmentList;