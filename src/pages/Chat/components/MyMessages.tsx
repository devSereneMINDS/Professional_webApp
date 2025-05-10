/* eslint-disable @typescript-eslint/no-explicit-any */
import Sheet from '@mui/joy/Sheet';
import MessagesPane from './MessagePane';
import ChatsPane from './ChatsPane';
import { useSelector } from 'react-redux';
// import { ChatProps } from '../utils/types';

export default function MyProfile() {
  // Get the entire chat state from Redux
  // const currentChat = useSelector((state: any) => state.userChat);

  // // Construct selectedChat from Redux state
  // const selectedChat: ChatProps | null = currentChat.chatId ? {
  //   id: currentChat.chatId,
  //   user: currentChat.user,
  //   isCurrentUserBlocked: currentChat.isCurrentUserBlocked,
  //   isReceiverBlocked: currentChat.isReceiverBlocked,
  // } : null;

  // console.log('Current chat from Redux:', currentChat);
  // console.log('Selected chat:', selectedChat);

  const selectedChatId = useSelector((state : any) => state.userChat?.selectedChatId);


  return (
    <Sheet
      sx={{
        position: 'fixed',
        width: '80%',
        height: '100vh',
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
          position: { xs: 'fixed', sm: 'sticky' },
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
          // Removed setSelectedChat as it's managed via Redux
        />
      </Sheet>
      <MessagesPane  />
    </Sheet>
  );
}