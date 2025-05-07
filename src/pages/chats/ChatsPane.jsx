import React, { useEffect, useState } from "react";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { Box, Chip, IconButton, Input, ListItemButton } from "@mui/joy";
import List from "@mui/joy/List";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { FaUserCircle } from "react-icons/fa";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { changeChat } from "../../store/slices/userChatSlice";
// import AddUser from "../List/ChatList/AddUser/AddUser";

export default function ChatsPane() {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addMode, setAddMode] = useState(false);
  const dispatch = useDispatch();
  const professionalId = useSelector((state) => state.professional?.data?.uid);

  useEffect(() => {
    if (!professionalId) return;

    const chatDocRef = doc(db, "userchats", professionalId);
    const unSub = onSnapshot(chatDocRef, async (res) => {
      const chatData = res.data();
      if (!chatData || !chatData.chats) {
        setChats([]);
        return;
      }

      const items = chatData.chats;
      const promises = items.map(async (item) => {
        const userDocSnap = await getDoc(doc(db, "users", item?.recieverId));
        return {
          ...item,
          user: userDocSnap.exists() ? userDocSnap.data() : null,
        };
      });

      const chatsData = await Promise.all(promises);
      setChats(chatsData.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
    });

    return () => unSub();
  }, [professionalId]);

  const handleSelect = (chat) => async () => {
    const userChats = chats.map((item) =>
      item.chatId === chat.chatId ? { ...item, isSeen: true } : item
    );
    setChats(userChats);
    dispatch(changeChat({ chatId: chat.chatId, user: chat.user }));
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sheet
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        height: "100dvh",
        overflowY: "auto",
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between", p: 2 }}>
        <Typography component="h1" sx={{ fontSize: "lg", fontWeight: "lg", mr: "auto" }}>
          Messages
          <Chip variant="soft" color="primary" size="md" sx={{ ml: 1 }}>{filteredChats.length}</Chip>
        </Typography>
        {/* <IconButton variant="plain" color="neutral" size="sm" onClick={() => setAddMode(!addMode)}>
          {addMode ? <RemoveRoundedIcon /> : <AddRoundedIcon />}
        </IconButton> */}
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

      <List sx={{ py: 0 }}>
        {filteredChats.map((chat) => (
          <ListItemButton key={chat.chatId} onClick={handleSelect(chat)}>
            <FaUserCircle size={30} />
            <Box sx={{ ml: 2 }}>
              <Typography>{chat.user?.displayName || "Unknown User"}</Typography>
              <Typography level="body-sm" sx={{ color: chat.isSeen ? "text.secondary" : "primary.main" }}>
                {chat.lastMessage || "No messages yet"}
              </Typography>
            </Box>
          </ListItemButton>
        ))}
      </List>

      {/* {addMode && <AddUser onClose={() => setAddMode(false)} />} */}
    </Sheet>
  );
}