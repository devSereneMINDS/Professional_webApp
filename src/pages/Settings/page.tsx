// import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from '../../components/Slidebar';
import Header from '../../components/Header';
import MyProfile from './components/MyProfile';

export default function JoyOrderDashboardTemplate() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh',width:"98vw" }}>
        <Sidebar />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Header />
          <Box
            component="main"
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              p: { xs: 2, md: 3 },
            }}
          >
            <MyProfile />
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}