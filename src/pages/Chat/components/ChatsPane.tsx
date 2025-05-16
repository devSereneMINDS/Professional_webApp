/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Box, IconButton, Input } from '@mui/joy';
import List from '@mui/joy/List';
//import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatListItem from './ChatListItem';
import { ChatProps } from '../utils/types';
import { toggleMessagesPane } from '../utils/utils';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { changeChat } from '../../../store/slices/userChatSlice';
import Avatar from '@mui/joy/Avatar';
import ListItemButton from '@mui/joy/ListItemButton';
import ListDivider from '@mui/joy/ListDivider';


type ChatsPaneProps = {
  selectedChatId?: string;
  onSelectChat?: () => void;
};

export default function ChatsPane(props: ChatsPaneProps) {
  const { selectedChatId, onSelectChat } = props;
  const [chats, setChats] = React.useState<ChatProps[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const professionalId = useSelector((state: any) => state.professional?.data?.uid);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!professionalId) return;

    const chatDocRef = doc(db, "userchats", professionalId);
    const unSub = onSnapshot(chatDocRef, async (res) => {
      const chatData = res.data();
      if (!chatData || !chatData.chats) {
        setChats([]);
        return;
      }

      const items = chatData.chats;
      const promises = items.map(async (item: any) => {
        const userDocSnap = await getDoc(doc(db, "users", item?.recieverId));
        return {
          id: item.chatId,
          sender: userDocSnap.exists() ? userDocSnap.data() : null,
          messages: [{
            content: item.lastMessage || "No messages yet",
            timestamp: item.updatedAt,
            unread: (!item.isSeen).toString()
          }],
          updatedAt: item.updatedAt
        };
      });

      const chatsData = await Promise.all(promises);
      setChats(chatsData.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
    });

    return () => unSub();
  }, [professionalId]);

  const handleSelect = (chat: ChatProps) => {
    const updatedChats = chats.map((item) =>
      item.id === chat.id ? { 
        ...item, 
        messages: item.messages.map(msg => ({ ...msg, unread: false }))
      } : item
    );
    setChats(updatedChats);
    dispatch(changeChat({ chatId: chat.id, user: chat.sender }));
    
    // Call the onSelectChat prop to notify parent component
    if (onSelectChat) {
      onSelectChat();
    }
  };

  const handleGroupChatSelect = () => {
    dispatch(
      changeChat({
        chatId: 'group_chat',
        user: {
          displayName: 'Group Chat',
          email: 'community@example.com',
          isGroup: true,
        },
        isGroupChat: true,
      })
    );
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.sender?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.sender?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: { sm: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        overflowY: 'auto',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 1.5 }}
      >
        <Typography
          component="h1"
          sx={{ fontSize: { xs: 'md', md: 'lg' }, fontWeight: 'lg', mr: 'auto' }}
        >
          Messages
        </Typography>
{/*         <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          sx={{ display: { xs: 'none', sm: 'unset' } }}
        >
          <EditNoteRoundedIcon />
        </IconButton> */}
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => {
            toggleMessagesPane();
          }}
          sx={{ display: { sm: 'none' } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <List
        sx={{
          py: 0,
          '--ListItem-paddingY': '0.75rem',
          '--ListItem-paddingX': '1rem',
        }}
      >
        <ListItemButton
          onClick={handleGroupChatSelect}
          selected={selectedChatId === 'group_chat'}
        >
          <Avatar size="lg">
            <GroupsIcon />
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography>Group Chat</Typography>
            <Typography level="body-sm">Community discussion</Typography>
          </Box>
        </ListItemButton>

        <ListDivider sx={{ margin: 0 }} />
        
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            {...chat}
            setSelectedChat={handleSelect}
            selectedChatId={selectedChatId}
          />
        ))}
      </List>
    </Sheet>
  );
}
