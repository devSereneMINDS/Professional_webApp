/* eslint-disable @typescript-eslint/no-explicit-any */
import Sheet from '@mui/joy/Sheet';
import MessagesPane from './MessagePane';
import ChatsPane from './ChatsPane';
import { useSelector } from 'react-redux';
import { useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

export default function MyProfile() {
  const selectedChatId = useSelector((state: any) => state.userChat?.selectedChatId);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showChats, setShowChats] = useState(true);

  // Automatically show messages pane when a chat is selected on mobile
  // and show chats pane when no chat is selected
  const shouldShowChats = isMobile ? (showChats && !selectedChatId) : true;
  const shouldShowMessages = isMobile ? (!showChats || !!selectedChatId) : true;

  const handleSelectChat = () => {
    if (isMobile) {
      setShowChats(false);
    }
  };

  const handleBackToChats = () => {
    setShowChats(true);
    console.log("hua toh h")
    // You might want to clear the selectedChatId here if needed
    // dispatch(clearSelectedChat());
  };



  return (
    <Sheet
      sx={{
        position: 'fixed',
        width: isMobile ? '100%' : '80%',
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(min-content, min(30%, 400px)) 1fr',
        },
        zIndex: 100,
        left: isMobile ? 0 : 'auto',
      }}
    >
      {/* Chats Pane */}
      <Sheet
        sx={{
          position: { xs: 'fixed', sm: 'sticky' },
          top: 0,
          transform: {
            xs: shouldShowChats ? 'translateX(0)' : 'translateX(-100%)',
            sm: 'none',
          },
          transition: 'transform 0.4s ease',
          width: '100%',
          height: '100%',
          zIndex: { xs: 110, sm: 'auto' },
          display: { xs: shouldShowChats ? 'block' : 'none', sm: 'block' },
        }}
      >
        <ChatsPane 
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
        />
      </Sheet>

      {/* Messages Pane */}
      <Sheet
        sx={{
          position: { xs: 'fixed', sm: 'relative' },
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: { xs: 120, sm: 'auto' },
          
          display: { xs: shouldShowMessages ? 'block' : 'none', sm: 'block' },
          transform: {
            xs: shouldShowMessages ? 'translateX(0)' : 'translateX(100%)',
            sm: 'none',
          },
          transition: 'transform 0.4s ease',
        }}
      >
        <MessagesPane 
          onBackClick={handleBackToChats}
          showBackButton={isMobile && !showChats}
        />
      </Sheet>
    </Sheet>
  );
}