import React, { useEffect, useState } from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import AvatarWithStatus from '../AvatarWithStatus';
// import { toggleMessagesPane } from '../../utils/utils';
import { db } from '../../firebaseConfig';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { changeChat } from '../../store/slices/userChatSlice';

export default function ChatListItem(props) {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedChatId = useSelector((state) => state.userChat?.selectedChatId);
  const professionalId = useSelector((state) => state.professional?.data?.id);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!professionalId) return;
  //   const unSub = onSnapshot(doc(db, "userchats", professionalId), async (res) => {
  //     const items = res.data().chats;
  //     console.log("1234567",items);
  //     const promises = items.map(async (item) => {
  //       const userDocSnap = await getDoc(doc(db, "users", item?.recieverId));
  //       return { ...item, user: userDocSnap.data() };
  //     });

  //     const chatsData = await Promise.all(promises);
  //     setChats(chatsData.sort((a, b) => b.updatedAt - a.updatedAt));
  //   });

  //   return () => {
  //     unSub();
  //   };
  // }, [professionalId]);

  const handleSelect = (chat) => async () => {
    const updatedChats = chats.map((item) =>
      item.chatId === chat.chatId ? { ...item, isSeen: true } : item
    );
    setChats(updatedChats);
    dispatch(changeChat({ chatId: chat.chatId, user: chat.user }));
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.user?.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.user?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <>
    {filteredChats.map((chat) => (
      <React.Fragment key={chat.chatId}>
        <ListItem>
          <ListItemButton
            onClick={handleSelect(chat)}
            selected={selectedChatId === chat.chatId}
            color="neutral"
            sx={{ flexDirection: "column", alignItems: "initial", gap: 1 }}
          >
            <Stack direction="row" spacing={1.5}>
              <AvatarWithStatus online={chat.user?.online} src={chat.user?.avatar} />
              <Box sx={{ flex: 1 }}>
                <Typography level="title-sm">{chat.user?.displayName || "Unknown"}</Typography>
                <Typography level="body-sm">{chat.user?.email || "No Email"}</Typography>
              </Box>
              <Box sx={{ lineHeight: 1.5, textAlign: "right" }}>
                {!chat.isSeen && <CircleIcon sx={{ fontSize: 12 }} color="primary" />}
                <Typography
                  level="body-xs"
                  noWrap
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  {chat.lastMessageTime || "Just now"}
                </Typography>
              </Box>
            </Stack>
            <Typography
              level="body-sm"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {chat.lastMessage || "No messages yet"}
            </Typography>
          </ListItemButton>
        </ListItem>
        <ListDivider sx={{ margin: 0 }} />
      </React.Fragment>
    ))}
    </>
  );
}
