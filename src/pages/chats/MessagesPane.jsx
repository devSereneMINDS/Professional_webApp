import React, { useState, useEffect, useRef } from 'react';
import { getDoc, updateDoc, doc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../../firebaseConfig';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';

export default function MessagesPane({ chat }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState('');
  const endRef = useRef(null);

  const { chatId, user } = useSelector((state) => state.userChat);
  const professionalUID = useSelector((state) => state.professional?.data?.uid);

  useEffect(() => {
    if (!chatId) return;

    console.log("Chat for header",chatId);
    console.log("User for which Chat",user);

    const unSub = onSnapshot(doc(db, 'chats', chatId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setChatMessages(docSnapshot.data().messages);
      }
    });

    return () => unSub();
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    if (textAreaValue.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: textAreaValue,
      senderId: professionalUID,
      date: Date.now(),
    };

    try {
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion(newMessage),
      });

      const userIds = [professionalUID, user.id];

      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, 'userchats', id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const chats = userChatsSnapshot.data().chats;
          const chatIndex = chats.findIndex((c) => c.chatId === chatId);
          if (chatIndex !== -1) {
            chats[chatIndex].lastMessage = textAreaValue;
            chats[chatIndex].isSeen = id === professionalUID;
            chats[chatIndex].updatedAt = Date.now();
            await updateDoc(userChatsRef, { chats });
          }
        }
      });

      setTextAreaValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Sheet
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '90vh',
        overflow: 'hidden',
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
            color: 'gray',
          }}
        >
          Select A User To Chat
        </Box>
      ) : (
        <>
          {/* Sticky Header */}
          <Box
            sx={{
              flexShrink: 0,
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: 'background.paper',
            }}
          >
            <MessagesPaneHeader />
          </Box>

          {/* Scrollable Chat Section */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 2,
              py: 3,
            }}
          >
            <Stack spacing={2} sx={{ justifyContent: 'flex-end' }}>
              {chatMessages.map((message) => {
                const isYou = message.senderId === professionalUID;
                return (
                  <Stack
                    key={message.id}
                    direction="row"
                    spacing={2}
                    sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
                  >
                    {!isYou && <AvatarWithStatus />}
                    <ChatBubble
                      variant={isYou ? 'sent' : 'received'}
                      sender={message.user}
                      content={message.text}
                      timestamp={new Date(message.date).toLocaleTimeString()}
                    />
                  </Stack>
                );
              })}
            </Stack>
            <div ref={endRef}></div>
          </Box>

          {/* Sticky Message Input */}
          <Box
            sx={{
              flexShrink: 0,
              position: 'sticky',
              bottom: 0,
              zIndex: 1,
              backgroundColor: 'background.paper',
              px: 2,
              py: 3,
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
