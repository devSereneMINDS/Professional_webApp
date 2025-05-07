import * as React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useColorScheme } from '@mui/joy/styles';
import { useSelector } from 'react-redux';

export default function AppointmentsBarChart() {
  const { upcoming, completed } = useSelector((state) => state.appointments);
  const paymentStats = useSelector((state) => state.paymentStats.stats);
  
  const { systemMode } = useColorScheme();
  const isDark = systemMode === 'dark';
  
  const colorPalette = [
    isDark ? 'var(--joy-palette-primary-500)' : 'var(--joy-palette-primary-700)', // Upcoming
    isDark ? 'var(--joy-palette-success-500)' : 'var(--joy-palette-success-700)', // Completed
  ];

  // Get the last 6 months names with years to avoid ambiguity
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

  // Count appointments by month
  const countAppointmentsByMonth = (appointments, monthLabels) => {
    return monthLabels.map(label => {
      const [monthStr, yearStr] = label.split(' ');
      const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth();
      const year = parseInt(yearStr);
      
      return appointments.filter(appt => {
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

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
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
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.8,
              barGapRatio: 0.1,
              data: monthLabels,
            },
          ]}
          series={[
            {
              id: 'upcoming',
              label: 'Upcoming',
              data: upcomingData,
              stack: 'A',
            },
            {
              id: 'completed',
              label: 'Completed',
              data: completedData,
              stack: 'A',
            },
          ]}
          height={350}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: false,
              position: { vertical: 'top', horizontal: 'right' },
            },
          }}
          sx={{
            '& .MuiBarElement-root': {
              rx: 0,
              width: 40,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}