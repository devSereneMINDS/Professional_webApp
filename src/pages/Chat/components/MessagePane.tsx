/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { MessageProps } from '../utils/types';

export default function MessagesPane() {
  const [chatMessages, setChatMessages] = React.useState<MessageProps[]>([]);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const endRef = React.useRef<HTMLDivElement>(null);

  const { chatId, user } = useSelector((state: any) => state.userChat);
  const professional = useSelector((state: any) => state.professional?.data);
  const professionalUID = professional?.uid;

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
        content: msg.text || msg.content,
        timestamp: new Date(msg.date).toLocaleTimeString(),
        sender: msg.senderId === professionalUID 
          ? 'You' 
          : {
              displayName: user?.displayName || 'Unknown',
              name: user?.name || '',
              username: user?.username || '',
              avatar: user?.photoURL || user?.avatar || '',
              online: true,
            },
        senderId: msg.senderId,
        date: msg.date
      }));

      setChatMessages(
        formattedMessages.sort(
          (a: MessageProps, b: MessageProps) => (a.date || 0) - (b.date || 0)
        )
      );
    });

    return () => unSub();
  }, [chatId, professionalUID, user]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    const trimmedValue = textAreaValue.trim();
    if (!trimmedValue || !chatId || !professionalUID) return;

    const newMessage = {
      id: Date.now().toString(),
      content: trimmedValue,
      senderId: professionalUID,
      date: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      sender: 'You' as const,
    };

    try {
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion(newMessage),
      });

      const userIds = [professionalUID, user?.id].filter(Boolean);

      await Promise.all(
        userIds.map(async (id) => {
          if (!id) return;
          const userChatsRef = doc(db, 'userchats', id);
          const userChatsSnap = await getDoc(userChatsRef);
          
          if (userChatsSnap.exists()) {
            const chats = userChatsSnap.data().chats || [];
            const chatIndex = chats.findIndex((c: any) => c.chatId === chatId);
            
            if (chatIndex !== -1) {
              const updatedChats = [...chats];
              updatedChats[chatIndex] = {
                ...updatedChats[chatIndex],
                lastMessage: trimmedValue,
                isSeen: id === professionalUID,
                updatedAt: Date.now(),
              };
              await updateDoc(userChatsRef, { chats: updatedChats });
            }
          }
        })
      );

      setTextAreaValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      {!user ? (
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
          <MessagesPaneHeader />

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
            <Stack spacing={2} sx={{ justifyContent: 'flex-end' }}>
              {chatMessages.map((message) => {
                const isYou = message.sender === 'You' || message.senderId === professionalUID;
                return (
                  <Stack
                    key={message.id}
                    direction="row"
                    spacing={2}
                    sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
                  >
                    {!isYou && (
                      <AvatarWithStatus 
                        src={typeof message.sender !== 'string' ? message.sender.avatar : ''}
                        online={typeof message.sender !== 'string' ? message.sender.online : false}
                      />
                    )}
                    <ChatBubble
                      id={message.id}
                      senderId={message.senderId}
                      date={message.date}
                      variant={isYou ? 'sent' : 'received'}
                      sender={isYou ? 'You' : message.sender}
                      content={message.content}
                      timestamp={message.timestamp} chatId={''} messageId={''}                    />
                  </Stack>
                );
              })}
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