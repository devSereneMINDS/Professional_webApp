// components/DashboardCards.jsx
import { Card, Typography, Box } from '@mui/joy';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changeColor?: string;
  timePeriod: string;
  gradientColors: [string, string];
  barColor: string;
}

export const StatCard = ({ title, value, change, changeColor, timePeriod, gradientColors, barColor }: StatCardProps) => {
  return (
    <Card variant="outlined" sx={{ gap: 0, p: 2 }}>
      <Typography level="title-md" variant="plain" sx={{ pb: 0.5 }}>{title}</Typography>
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography level="h3">{value}</Typography>
        {change && <Typography level="body-xs" sx={{ color: changeColor, px: 1 }}>{change}</Typography>}
      </Box>
      <Typography level="body-xs" color="neutral">{timePeriod}</Typography>
      <Box sx={{ 
        mt: 3, 
        width: '100%', 
        height: 30, 
        background: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`, 
        borderRadius: '10px', 
        position: 'relative' 
      }}>
        <Box sx={{ 
          position: 'absolute', 
          left: 0, 
          bottom: 0, 
          width: '100%', 
          height: 2, 
          backgroundColor: barColor 
        }} />
      </Box>
    </Card>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

export const ActionCard = ({ title, description, buttonText, onClick }: ActionCardProps) => {
  return (
    <Card variant="outlined" sx={{ gap: 0, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography level="title-md" variant="plain" sx={{ pb: 0.5 }}>{title}</Typography>
      <Typography level="body-xs" color="neutral">{description}</Typography>
      <Box sx={{ mt: 3 }}>
        <button 
          style={{
            padding: '6px 12px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={onClick}
        >
          {buttonText}
        </button>
      </Box>
    </Card>
  );
};