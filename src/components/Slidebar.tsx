import PaidIcon from '@mui/icons-material/Paid';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
//import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import EventIcon from '@mui/icons-material/Event';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ColorSchemeToggle from './modules/ColorSchemeToggle';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { closeSidebar } from './utils';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetProfessionalData } from '../store/slices/ProfessionalSlice';
import { Button, IconButton, useColorScheme, useTheme } from '@mui/joy';
import useMediaQuery from '@mui/material/useMediaQuery';

interface ProfessionalData {
  id?: string;
  full_name?: string;
  email?: string;
  photo_url?: string;
}

export default function Sidebar() {
  const professional = useSelector((state: RootState) => state.professional as { data?: ProfessionalData });
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mode } = useColorScheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Detect mobile view

  const AddNewClient = () => {
    navigate("/add-new-client");
    closeSidebar();
  };

  const userEmail = localStorage.getItem("userEmail");
  const googleAccessToken = localStorage.getItem("googleAccessToken");
  if (!userEmail && !googleAccessToken && !professional?.data?.id) {
    // Redirect to login page
      navigate("/login");
    }


  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("googleAccessToken");
    dispatch(resetProfessionalData());

    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    return currentPath.startsWith(path) && path !== '/';
  };

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

      {isMobile && (
        <IconButton
          size="sm"
          variant="soft"
          color="neutral"
          onClick={closeSidebar}
          sx={{
            position: 'absolute',
            top: 8,
            zIndex: 9999,
            display: { xs: 'inline-flex', md: 'none' },
          }}
        >
          <MenuRoundedIcon />
        </IconButton>
      )}
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
  onClick={AddNewClient}
>
  Add New
</Button>
      </Box>
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
              onClick={() => {
                navigate("/");
                closeSidebar();
              }}
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
              onClick={() => {navigate("/appointments");
                 closeSidebar()} }
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
              onClick={() => {navigate("/clients");
                closeSidebar();
              }}
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
              onClick={() => {navigate("/calendar");
                closeSidebar();
              }}
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
              onClick={() => {navigate("/payment");
                closeSidebar();
              }}
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
              onClick={() => {navigate("/chats");
                closeSidebar();
              }}
              selected={isActive('/chats')}
              sx={activeStyle('/chats')}
            >
              <QuestionAnswerRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Chats</Typography>
              </ListItemContent>
            {/* <Chip size="sm" color="primary" variant="solid">
                4
              </Chip> */}
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              role="menuitem"
              onClick={() => {navigate("/settings");
                closeSidebar();
              }}
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
{/*           <Typography level="body-xs">{professional?.data?.email}</Typography> */}
        </Box>
      </Box>
    </Sheet>
  );
}
