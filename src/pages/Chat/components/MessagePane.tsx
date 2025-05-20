/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
  getDoc,
  setDoc,
  updateDoc,
  doc,
  onSnapshot,
  arrayUnion,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../../../firebaseConfig';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatsBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import IconButton from '@mui/joy/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/joy/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MessageProps } from '../utils/types';

interface MessagesPaneProps {
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export default function MessagesPane({ onBackClick, showBackButton }: MessagesPaneProps) {
  const [chatMessages, setChatMessages] = React.useState<MessageProps[]>([]);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const endRef = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { chatId, user, isGroupChat } = useSelector((state: any) => state.userChat);
  const professional = useSelector((state: any) => state.professional?.data);
  const professionalUID = professional?.uid;

  const chatCollection = isGroupChat ? 'groupMessages' : 'chats';

  React.useEffect(() => {
    if (!chatId) {
      setChatMessages([]);
      return;
    }

    const unSub = onSnapshot(doc(db, chatCollection, chatId), (docSnapshot) => {
      if (!docSnapshot.exists()) {
        setChatMessages([]);
        return;
      }

      const messagesData = docSnapshot.data().messages || [];
      const formattedMessages = messagesData.map((msg: any) => ({
        id: msg.id?.toString(),
        content: msg.text || msg.content,
        timestamp: new Date(msg.date).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sender:
          msg.senderId === professionalUID
            ? 'You'
            : {
                displayName: msg.senderName || user?.displayName || 'Unknown',
                name: msg.senderName || user?.name || '',
                username: msg.username || '',
                avatar: msg.avatar || user?.photoURL || '',
                online: true,
              },
        senderId: msg.senderId,
        date: msg.date,
      }));

      setChatMessages(
        formattedMessages.sort((a: MessageProps, b: MessageProps) => (a.date || 0) - (b.date || 0))
      );
    });

    return () => unSub();
  }, [chatId, professionalUID, user, isGroupChat, chatCollection]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    const trimmedValue = textAreaValue.trim();
    if (!trimmedValue || !chatId || !professionalUID) return;

    const newMessage = {
      id: Date.now().toString(),
      text: trimmedValue,
      senderId: professionalUID,
      senderName: professional?.displayName || 'Professional',
      date: Date.now(),
    };

    try {
      if (isGroupChat) {
        const groupChatRef = doc(db, 'groupMessages', chatId);
        const docSnap = await getDoc(groupChatRef);
        if (!docSnap.exists()) {
          await setDoc(groupChatRef, {
            messages: [],
            participants: [],
            createdAt: new Date().toISOString(),
          });
        }
      }

      await updateDoc(doc(db, chatCollection, chatId), {
        messages: arrayUnion(newMessage),
      });

      // For individual chat, update userchats metadata
      if (!isGroupChat) {
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
      }

      setTextAreaValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh)', md: 'calc(100dvh)' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
        position: 'relative',
        width: '100%',
        mt: { xs: '42px', sm: 0 },
      }}
    >
      {!user ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontSize: isMobile ? '1rem' : '1.2rem',
            color: 'text.secondary',
            px: isMobile ? 1 : 2,
            textAlign: 'center',
          }}
        >
          Select a chat to start messaging
        </Box>
      ) : (
        <>
          <MessagesPaneHeader
            startDecorator={
              showBackButton && (
                <IconButton
                  variant="plain"
                  color="neutral"
                  size="sm"
                  onClick={() => onBackClick?.()}
                  sx={{ mr: 1 }}
                >
                  <ArrowBack />
                </IconButton>
              )
            }
          />

          <Box
            sx={{
              display: 'flex',
              flex: 1,
              minHeight: 0,
              px: isMobile ? 0.5 : 2,
              py: isMobile ? 0.5 : 3,
              overflowY: 'auto',
              flexDirection: 'column-reverse',
            }}
          >
            <Stack spacing={isMobile ? 1 : 1.5} sx={{ justifyContent: 'flex-end' }}>
              {chatMessages.map((message) => {
                const isYou = message.sender === 'You' || message.senderId === professionalUID;
                return (
                  <Stack
                    key={message.id}
                    direction="row"
                    spacing={isMobile ? 1 : 1.5}
                    sx={{
                      flexDirection: isYou ? 'row-reverse' : 'row',
                      px: isMobile ? 0.5 : 0,
                    }}
                  >
                    {!isYou && (
                      <AvatarWithStatus
                        src={typeof message.sender !== 'string' ? message.sender.avatar : ''}
                        online={typeof message.sender !== 'string' ? message.sender.online : false}
                        sx={{
                          width: isMobile ? 32 : 40,
                          height: isMobile ? 32 : 40,
                        }}
                      />
                    )}
                    <ChatBubble
                      id={message.id}
                      senderId={message.senderId}
                      date={message.date}
                      variant={isYou ? 'sent' : 'received'}
                      sender={isYou ? 'You' : message.sender}
                      content={message.content}
                      timestamp={message.timestamp}
                      chatId={chatId}
                      messageId={message.id}
                    />
                  </Stack>
                );
              })}
              <div ref={endRef} />
            </Stack>
          </Box>

          <Box
            sx={{
              px: isMobile ? 1 : 2,
              pb: isMobile ? 1 : 2,
              pt: isMobile ? 1 : 0,
            }}
          >
            <MessageInput
              textAreaValue={textAreaValue}
              setTextAreaValue={setTextAreaValue}
              onSubmit={handleSend}
            />
          </Box>
        </>
      )}
    </Sheet>
  );
}
