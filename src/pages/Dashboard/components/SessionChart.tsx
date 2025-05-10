import { useColorScheme } from '@mui/joy/styles';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { LineChart } from '@mui/x-charts/LineChart';

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

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-US', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function SessionsChart() {
  const { systemMode } = useColorScheme();
  const isDark = systemMode === 'dark';
  const data = getDaysInMonth(4, 2024);

  const colorPalette = [
    isDark ? 'var(--joy-palette-primary-300)' : 'var(--joy-palette-primary-500)',
    isDark ? 'var(--joy-palette-primary-500)' : 'var(--joy-palette-primary-700)',
    isDark ? 'var(--joy-palette-primary-700)' : 'var(--joy-palette-primary-900)',
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography level="h2" fontSize="sm" gutterBottom>
          Earnings
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
              13,277
            </Typography>
            <Chip size="sm" color="success" variant="soft">
              +35%
            </Chip>
          </Stack>
          <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
            Earnings per day for the last 30 days
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data,
              tickInterval: ( i) => (i + 1) % 5 === 0,
            },
          ]}
          series={[
            {
              id: 'direct',
              label: 'Direct',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: [
                300, 900, 600, 1200, 1500, 1800, 2400, 2100, 2700, 3000, 1800, 3300,
                3600, 3900, 4200, 4500, 3900, 4800, 5100, 5400, 4800, 5700, 6000,
                6300, 6600, 6900, 7200, 7500, 7800, 8100,
              ],
            },
            {
              id: 'referral',
              label: 'Referral',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: [
                500, 900, 700, 1400, 1100, 1700, 2300, 2000, 2600, 2900, 2300, 3200,
                3500, 3800, 4100, 4400, 2900, 4700, 5000, 5300, 5600, 5900, 6200,
                6500, 5600, 6800, 7100, 7400, 7700, 8000,
              ],
            },
            {
              id: 'organic',
              label: 'Organic',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              stackOrder: 'ascending',
              data: [
                1000, 1500, 1200, 1700, 1300, 2000, 2400, 2200, 2600, 2800, 2500,
                3000, 3400, 3700, 3200, 3900, 4100, 3500, 4300, 4500, 4000, 4700,
                5000, 5200, 4800, 5400, 5600, 5900, 6100, 6300,
              ],
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-organic': {
              fill: "url('#organic')",
            },
            '& .MuiAreaElement-series-referral': {
              fill: "url('#referral')",
            },
            '& .MuiAreaElement-series-direct': {
              fill: "url('#direct')",
            },
          }}
          slotProps={{
          }}
        >
          <AreaGradient color={colorPalette[2]} id="organic" />
          <AreaGradient color={colorPalette[1]} id="referral" />
          <AreaGradient color={colorPalette[0]} id="direct" />
        </LineChart>
      </CardContent>
    </Card>
  );
}