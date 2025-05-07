import * as React from 'react';
import { getDoc, updateDoc, doc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../../../firebaseConfig';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatsBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { ChatProps, MessageProps } from '../utils/types';

type MessagesPaneProps = {
  chat: ChatProps;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { chat } = props;
  const [chatMessages, setChatMessages] = React.useState<MessageProps[]>([]);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const endRef = React.useRef<HTMLDivElement>(null);

  const { chatId } = useSelector((state: any) => state.userChat);
  const professional = useSelector((state: any) => state.professional?.data);
  const professionalId = professional?.uid;

  React.useEffect(() => {
    if (!chatId) {
      setChatMessages([]);
      return;
    }

    const unSub = onSnapshot(doc(db, 'chats', chatId), (docSnapshot) => {
      if (!docSnapshot.exists()) {
        setChatMessages([]);
        return;
      }

      const messagesData = docSnapshot.data().messages || [];
      const formattedMessages = messagesData.map((msg: any) => ({
        id: msg.id.toString(),
        sender: msg.senderId === professionalId 
          ? 'You' 
          : {
              name: chat.sender?.displayName || chat.sender?.name || 'Unknown',
              avatar: chat.sender?.photoURL || chat.sender?.avatar || '',
              online: true,
              id: chat.sender?.id
            },
        content: msg.text,
        timestamp: formatTimestamp(msg.date),
        date: msg.date
      }));

      setChatMessages(formattedMessages.sort((a, b) => a.date - b.date));
    });

    return () => unSub();
  }, [chatId, professionalId, chat.sender]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    const trimmedValue = textAreaValue.trim();
    if (!trimmedValue || !chatId || !professionalId) return;

    const newMessage = {
      id: Date.now(),
      text: trimmedValue,
      senderId: professionalId,
      date: Date.now(),
    };

    try {
      // Update messages in chats collection
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion(newMessage),
      });

      // Update last message in user chats
      const updatePromises = [professionalId, chat.sender?.id]
        .filter(Boolean)
        .map(async (userId) => {
          if (!userId) return;
          
          const userChatsRef = doc(db, "userchats", userId);
          const userChatsSnap = await getDoc(userChatsRef);
          
          if (userChatsSnap.exists()) {
            const chats = userChatsSnap.data().chats || [];
            const chatIndex = chats.findIndex((c: any) => c.chatId === chatId);
            
            if (chatIndex !== -1) {
              const updatedChats = [...chats];
              updatedChats[chatIndex] = {
                ...updatedChats[chatIndex],
                lastMessage: trimmedValue,
                isSeen: userId === professionalId,
                updatedAt: Date.now(),
              };
              
              await updateDoc(userChatsRef, { chats: updatedChats });
            }
          }
        });

      await Promise.all(updatePromises);
      setTextAreaValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString();
  };

  // Simplified rendering
  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      {!chatId ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontSize: '1.2rem',
            color: 'text.secondary',
          }}
        >
          Select a chat to start messaging
        </Box>
      ) : (
        <>
          <MessagesPaneHeader 
            sender={chat.sender} 
          />

          <Box
            sx={{
              display: 'flex',
              flex: 1,
              minHeight: 0,
              px: 2,
              py: 3,
              overflowY: 'auto',
              flexDirection: 'column-reverse',
            }}
          >
            <Stack spacing={2} justifyContent="flex-end">
              {chatMessages.map((message) => (
                <Stack
                  key={message.id}
                  direction="row"
                  spacing={2}
                  sx={{ 
                    flexDirection: message.sender === 'You' ? 'row-reverse' : 'row' 
                  }}
                >
                  {message.sender !== 'You' && (
                    <AvatarWithStatus
                      online={message.sender.online}
                      src={message.sender.avatar}
                    />
                  )}
                  <ChatBubble
                    variant={message.sender === 'You' ? 'sent' : 'received'}
                    {...message}
                  />
                </Stack>
              ))}
              <div ref={endRef} />
            </Stack>
          </Box>

          <MessageInput
            textAreaValue={textAreaValue}
            setTextAreaValue={setTextAreaValue}
            onSubmit={handleSend}
          />
        </>
      )}
    </Sheet>
  );
}