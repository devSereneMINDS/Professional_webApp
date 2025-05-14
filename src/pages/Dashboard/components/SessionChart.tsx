import { useColorScheme } from '@mui/joy/styles';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/joy/styles';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

export default function AppointmentsLineChart() {
  const { upcoming, completed } = useSelector((state: RootState) => state.appointments);
  const paymentStats = useSelector((state: RootState) => state.paymentStats.stats ?? { totalAppointments: 0, upcomingAppointmentsThisWeek: 0 });
  const { systemMode } = useColorScheme();
  const theme = useTheme();
  const isDark = systemMode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const colorPalette = [
    isDark ? 'var(--joy-palette-primary-500)' : 'var(--joy-palette-primary-700)', // Upcoming
    isDark ? 'var(--joy-palette-success-500)' : 'var(--joy-palette-success-700)', // Completed
  ];

  const getMonthLabels = () => {
    const labels = [];
    const date = new Date();
    for (let i = 5; i >= 0; i--) {
      const tempDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
      labels.push(tempDate.toLocaleString('default', { month: 'short', year: 'numeric' }));
    }
    return labels;
  };

  const monthLabels = getMonthLabels();

  interface Appointment {
    appointment_time: string;
  }

  const countAppointmentsByMonth = (appointments: Appointment[], monthLabels: string[]): number[] => {
    return monthLabels.map(label => {
      const [monthStr, yearStr] = label.split(' ');
      const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth();
      const year = parseInt(yearStr);
      
      return appointments.filter((appt: Appointment) => {
        const apptDate = new Date(appt.appointment_time);
        return (
          apptDate.getMonth() === month && 
          apptDate.getFullYear() === year
        );
      }).length;
    });
  };

  const upcomingData = countAppointmentsByMonth(upcoming, monthLabels);
  const completedData = countAppointmentsByMonth(completed, monthLabels);

  // Responsive margins
  const chartMargins = isMobile 
    ? { left: 10, right: 10, top: 20, bottom: 40 }  // Mobile margins
    : { left: 50, right: 20, top: 20, bottom: 40 }; // Desktop margins

  return (
    <Card variant="outlined" sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
      <CardContent>
        <Typography level="h2" fontSize="sm" gutterBottom>
          Appointments Overview
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography level="h1" fontSize="xl4" component="p">
              {paymentStats?.totalAppointments || '0'}
            </Typography>
            <Chip size="sm" color="primary" variant="soft">
              {paymentStats?.upcomingAppointmentsThisWeek || '0'} this week
            </Chip>
          </Stack>
          <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
            Appointments for the last 6 months
          </Typography>
        </Stack>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <LineChart
            colors={colorPalette}
            xAxis={[
              {
                scaleType: 'point',
                data: monthLabels,
                tickLabelStyle: isMobile 
                  ? { angle: 45, textAnchor: 'start', fontSize: 10 }
                  : { fontSize: 12 },
              },
            ]}
            series={[
              {
                id: 'upcoming',
                label: 'Upcoming',
                showMark: false,
                curve: 'linear',
                data: upcomingData,
              },
              {
                id: 'completed',
                label: 'Completed',
                showMark: false,
                curve: 'linear',
                data: completedData,
              },
            ]}
            height={isMobile ? 300 : 350}
            margin={chartMargins}
            grid={{ horizontal: true }}
            sx={{
              width: '100%',
              minWidth: isMobile ? '280px' : '400px',
              '& .MuiAreaElement-series-upcoming': {
                fill: "url('#upcoming')",
              },
              '& .MuiAreaElement-series-completed': {
                fill: "url('#completed')",
              },
            }}
          >
            <AreaGradient color={colorPalette[0]} id="upcoming" />
            <AreaGradient color={colorPalette[1]} id="completed" />
          </LineChart>
        </Box>
      </CardContent>
    </Card>
  );
}