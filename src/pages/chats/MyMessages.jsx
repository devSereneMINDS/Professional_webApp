import React, { useState } from 'react';
import Sheet from '@mui/joy/Sheet';

import MessagesPane from './MessagesPane';
import ChatsPane from './ChatsPane';
import { useSelector } from 'react-redux';

export default function MyProfile() {
  const selectedChatId = useSelector((state) => state.userChat?.selectedChatId);

  return (
    <Sheet
      sx={{
        position: 'fixed', // Set position to fixed
        width:"80%",
        height: '100vh', // Take full viewport height
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(min-content, min(30%, 400px)) 1fr',
        },
        zIndex: 100,
      }}
    >
      <Sheet
        sx={{
          position: 'sticky', // Sticky position for the inner Sheet
          top: 0,
          transform: {
            xs: 'translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))',
            sm: 'none',
          },
          transition: 'transform 0.4s, width 0.4s',
          width: '100%',
          height: '100%',
        }}
      >
        <ChatsPane
          selectedChatId={selectedChatId}
        />
      </Sheet>
      <MessagesPane />
    </Sheet>
  );
}
