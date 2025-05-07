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

const AppointmentList = () => {
  const navigate = useNavigate();
  const appointments = useSelector((state) => state.appointments);
  
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
        src="./appointment.png"
        alt="No appointments"
        style={{ maxWidth: '300px' }}
      />
      <Typography level="h5">No appointments scheduled yet</Typography>
      <Typography level="body-sm" sx={{ mb: 2 }}>
        Start taking appointments by adding clients
      </Typography>
      <Button 
        onClick={() => navigate('/clients/new')} 
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
            photoUrl={null} 
            meetLink={null} 
            isLoading 
          />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Box
        sx={{
          position: 'sticky',
          top: { sm: -100, md: -110 },
          bgcolor: 'background.body',
          width: '100%',
          maxWidth: 'none',
          zIndex: 1,
        }}
      >
        <Tabs defaultValue={0} sx={{ bgcolor: 'transparent' }}>
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

          <Box
            sx={{
              display: 'flex',
              width: '100%',
              mx: 'auto',
              px: { xs: 2, md: 6 },
              py: { xs: 2, md: 3 },
            }}
          >
            {/* Upcoming Appointments */}
            <TabPanel value={0} sx={{ width: '100%', p: 0 }}>
              {upcomingAppointments.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    maxHeight: 'calc(100vh - 200px)',
                    justifyContent: 'flex-start',
                    overflowY: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'neutral.400',
                      borderRadius: '2px',
                    },
                  }}
                >
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      id={appointment.id}
                      name={appointment.client?.name || appointment.clientname || 'Unknown'}
                      photoUrl={appointment.client?.photo_url}
                      date={new Date(appointment.appointment_time).toLocaleDateString()}
                      time={new Date(appointment.appointment_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      duration={appointment.duration || '45:00'}
                      contact={appointment.client?.phone_no || appointment.clientphone || 'N/A'}
                      meetLink={appointment.meet_link}
                      message={appointment.message}
                      isUpcoming={true}
                    />
                  ))}
                </Box>
              ) : renderEmptyState()}
            </TabPanel>

            {/* Completed Appointments */}
            <TabPanel value={1} sx={{ width: '100%', p: 0 }}>
              {completedAppointments.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    maxHeight: 'calc(100vh - 200px)',
                    justifyContent: 'flex-start',
                    overflowY: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'neutral.400',
                      borderRadius: '2px',
                    },
                  }}
                >
                  {completedAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      id={appointment.id}
                      name={appointment.client?.name || appointment.clientname || 'Unknown'}
                      photoUrl={appointment.client?.photo_url}
                      date={new Date(appointment.appointment_time).toLocaleDateString()}
                      time={new Date(appointment.appointment_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      duration={appointment.duration || '45:00'}
                      contact={appointment.client?.phone_no || appointment.clientphone || 'N/A'}
                      meetLink={appointment.meet_link}
                      message={appointment.message}
                      isUpcoming={false}
                    />
                  ))}
                </Box>
              ) : renderEmptyState()}
            </TabPanel>
          </Box>
        </Tabs>
      </Box>
    </Box>
  );
};

export default AppointmentList;