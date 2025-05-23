import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { useColorScheme } from '@mui/joy/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { getCurrencySymbol } from './CurrencySymbol';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/joy/styles';

export default function MaxEarningsBarChart() {
  const { systemMode } = useColorScheme();
  const theme = useTheme();
  const isDark = systemMode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const professional = useSelector((state: RootState) => state.professional.data);
  const currencySymbol = getCurrencySymbol(professional?.country || null);

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

  // Calculate maximum earnings
  const maxEarning = {
    day: `${monthName} ${year}`,
    value: paymentStats.totalFeesThisMonth || 0
  };

  const data = [maxEarning.day];
  const earnings = [maxEarning.value];

  const colorPalette = [
    isDark ? 'var(--joy-palette-primary-200)' : 'var(--joy-palette-primary-400)'
  ];

  // Responsive settings
  const chartMargins = isMobile 
    ? { left: 10, right: 10, top: 20, bottom: 40 }  // Mobile margins
    : { left: 50, right: 20, top: 20, bottom: 40 }; // Desktop margins

  const barWidth = isMobile ? 40 : 60;
  const chartHeight = isMobile ? 220 : 250;

  return (
    <Card variant="outlined" sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
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
            <Typography level="h1" fontSize={isMobile ? 'xl2' : 'xl4'} component="p">
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
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <BarChart
            borderRadius={8}
            colors={colorPalette}
            xAxis={[
              {
                scaleType: 'band',
                data: data,
                tickLabelStyle: isMobile 
                  ? { fontSize: 10 } 
                  : { fontSize: 12 },
              },
            ]}
            series={[
              {
                data: earnings,
                label: 'Earnings',
              },
            ]}
            height={chartHeight}
            margin={chartMargins}
            grid={{ horizontal: true }}
            sx={{
              '& .MuiBarElement-root': {
                rx: 4,
                width: barWidth,
              },
              width: '100%',
              minWidth: isMobile ? '250px' : '300px',
            }}
            slotProps={{
              legend: {
                position: { vertical: 'top', horizontal: 'end' },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}