// components/DashboardCards.jsx
import { Card, Typography, Box, Button } from '@mui/joy';

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
        {/* <button 
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
        </button> */}
        <Button 
          sx={{
            padding: '8px 20px',
            background: 'linear-gradient(rgba(2, 122, 242, 0.8), rgb(2, 107, 212))',
            color: '#fff',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.875rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'linear-gradient(rgba(2, 122, 242, 1), rgb(2, 94, 186))',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            },
            '&:active': {
              background: 'linear-gradient(rgba(1, 102, 202, 1), rgb(1, 82, 162))'
            }
          }}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </Box>
    </Card>
  );
};