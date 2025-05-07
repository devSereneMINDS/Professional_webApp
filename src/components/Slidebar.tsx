import PaidIcon from '@mui/icons-material/Paid';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import Input from '@mui/joy/Input';
import EventIcon from '@mui/icons-material/Event';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useColorScheme } from '@mui/joy/styles';
import ColorSchemeToggle from './modules/ColorSchemeToggle';
import { closeSidebar } from './utils';
import { useSelector } from 'react-redux';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetProfessionalData } from '../store/slices/ProfessionalSlice';

export default function Sidebar() {
  const { mode } = useColorScheme();
  const professional = useSelector((state) => state.professional);
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const AddNewClient = () => {
    window.location.href = `http://booking.sereneminds.life/${professional?.data?.id}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("googleAccessToken");
    dispatch(resetProfessionalData());
    navigate("/login");
  };

  // Helper function to determine if a path is active
  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    return currentPath.startsWith(path) && path !== '/';
  };

  // Style for active menu items
  const activeStyle = (path: string) => ({
    backgroundColor: isActive(path) ? 'var(--joy-palette-primary-softBg)' : 'initial',
    '&:hover': {
      backgroundColor: isActive(path) 
        ? 'var(--joy-palette-primary-softHoverBg)' 
        : 'var(--joy-palette-neutral-softHoverBg)',
    },
  });

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        top: 0,
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        width: 'var(--Sidebar-width)',
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
        alignSelf: 'flex-start',
        overflow: 'auto',
        height: '100dvh',
        maxHeight: '100vh',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 3 }}>
        <Box
          component="img"
          src={mode === 'dark' ? '/assets/logo_white1.png' : '/assets/logo_black1.png'}
          alt="Company Logo"
          sx={{
            height: '50px',
            width: 'auto',
            maxWidth: '100%',
          }}
        />
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>
      <Box sx={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', mx: 'auto', my: 0.5 }}>
        <button 
          style={{
            padding: '7px 25px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={AddNewClient}
        >
          Add New
        </button>
      </Box>
      <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" />
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton 
              role="menuitem"
              onClick={() => navigate("/")}
              selected={isActive('/')}
              sx={activeStyle('/')}
            >
              <DashboardRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Dashboard</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              role="menuitem"
              onClick={() => navigate("/appointments")}
              selected={isActive('/appointments')}
              sx={activeStyle('/appointments')}
            >
              <QuestionAnswerRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Appointments</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              role="menuitem"
              onClick={() => navigate("/clients")}
              selected={isActive('/clients')}
              sx={activeStyle('/clients')}
            >
              <PeopleAltIcon />
              <ListItemContent>
                <Typography level="title-sm">My Clients</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              role="menuitem"
              onClick={() => navigate("/calendar")}
              selected={isActive('/calendar')}
              sx={activeStyle('/calendar')}
            >
              <EventIcon />
              <ListItemContent>
                <Typography level="title-sm">Calendar</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              role="menuitem"
              onClick={() => navigate("/payment")}
              selected={isActive('/payment')}
              sx={activeStyle('/payment')}
            >
              <PaidIcon />
              <ListItemContent>
                <Typography level="title-sm">Payment</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              role="menuitem"
              onClick={() => navigate("/chats")}
              selected={isActive('/chats')}
              sx={activeStyle('/chats')}
            >
              <QuestionAnswerRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Chats</Typography>
              </ListItemContent>
              <Chip size="sm" color="primary" variant="solid">
                4
              </Chip>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              role="menuitem"
              onClick={() => navigate("/settings")}
              selected={isActive('/settings')}
              sx={activeStyle('/settings')}
            >
              <SettingsRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Settings</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              role="menuitem"
              onClick={handleLogout}
            >
              <LogoutIcon sx={{ color: '#EF4444' }} />
              <ListItemContent>
                <Typography level="title-sm" sx={{ color: '#EF4444' }}>
                  Log Out
                </Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar
          variant="outlined"
          size="sm"
          src={professional?.data?.photo_url}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{professional?.data?.full_name}</Typography>
          <Typography level="body-xs">{professional?.data?.email}</Typography>
        </Box>
      </Box>
    </Sheet>
  );
}