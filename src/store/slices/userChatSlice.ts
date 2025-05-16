import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  chatId: null,
  user: {},
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  isGroupChat: false
};

const userChatSlice = createSlice({
  name: "userChat",
  initialState,
  reducers: {
    changeChat: (state, action) => {
      const { chatId, user } = action.payload;
      state.chatId = chatId;
      state.user = user;
      state.isCurrentUserBlocked = user?.isBlockedByCurrentUser || false;
      state.isReceiverBlocked = user?.hasBlockedCurrentUser || false;
      state.isGroupChat = isGroupChat;
    },

    checkBlockStatus: (state, action) => {
      const { isCurrentUserBlocked, isReceiverBlocked } = action.payload;
      state.isCurrentUserBlocked = isCurrentUserBlocked;
      state.isReceiverBlocked = isReceiverBlocked;
    },

    changeBlock: (state, action) => {
        const { target, status } = action.payload;
        if (target === "currentUser") {
          state.isCurrentUserBlocked = status;
        } else if (target === "receiver") {
          state.isReceiverBlocked = status;
        }
      },
  },
});

export const { changeChat, checkBlockStatus } = userChatSlice.actions;
export default userChatSlice.reducer;
