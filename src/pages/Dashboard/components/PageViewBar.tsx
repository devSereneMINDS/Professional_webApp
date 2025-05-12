import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useColorScheme } from '@mui/joy/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store'; // Adjust the path to your store file
import { getCurrencySymbol } from './CurrencySymbol'
export default function MaxEarningsBarChart() {
  const { systemMode } = useColorScheme();
  const isDark = systemMode === 'dark';
  

  const professional = useSelector((state: RootState) => state.professional.data);
  console.log('Professional Data:', professional?.country);

  
  const currencySymbol = getCurrencySymbol(professional?.country || null);
  console.log('Currency Symbol:', currencySymbol);
  // Get data from Redux store
  const paymentStats = useSelector((state: RootState) => state.paymentStats.stats ?? { 
    totalFeesThisMonth: 0, 
    distinctClientsThisMonth: 0,
    upcomingAppointmentsThisWeek: 0,
    totalAppointments: 0
  });

  // Get current month and year for display
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('default', { month: 'short' });
  const year = currentDate.getFullYear();

  // Calculate maximum earnings (using totalFeesThisMonth from paymentStats)
  const maxEarning = {
    day: `${monthName} ${year}`,
    value: paymentStats.totalFeesThisMonth || 0
  };

  const data = [maxEarning.day];
  const earnings = [maxEarning.value];

  const colorPalette = [
    isDark ? 'var(--joy-palette-success-500)' : 'var(--joy-palette-success-700)'
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography level="h2" fontSize="sm" gutterBottom>
          Monthly Earnings
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
              {currencySymbol}{maxEarning.value.toLocaleString()}
            </Typography>
            <Chip size="sm" color="success" variant="soft">
              {paymentStats.distinctClientsThisMonth} clients
            </Chip>
          </Stack>
          <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
            Total earnings for {monthName} {year}
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              data: data,
            },
          ]}
          series={[
            {
              data: earnings,
              label: 'Earnings',
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiBarElement-root': {
              rx: 4,
              width: 60,
            },
          }}
          slotProps={{
            legend: {
              position: { vertical: 'top', horizontal: 'end' },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}