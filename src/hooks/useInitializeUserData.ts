import { useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { changeChat } from "../store/slices/userChatSlice";
import { db } from "../../firebaseConfig";

const useInitializeUserChats = () => {
  const dispatch = useDispatch();
  const professionalUID = useSelector(
    (state) => state.professional?.data?.uid
  );

  useEffect(() => {
    const initializeChats = async () => {
        console.log("Initializing user chats for UID:", professionalUID);

      if (!professionalUID) return;

      try {
        const userChatsRef = doc(db, "userchats", professionalUID);
        const userChatsSnap = await getDoc(userChatsRef);

        if (userChatsSnap.exists()) {
          const userChats = userChatsSnap.data().chats || []; 

          console.log("User chats data 1243", userChats);

          userChats.forEach((chat) => {
            dispatch(
              changeChat({
                chatId: chat.chatId,
                user: chat.user,
              })
            );
          });
        } else {
          // If no chats exist, create an empty chats document
          await setDoc(userChatsRef, { chats: [] });
        }
      } catch (error) {
        console.error("Error initializing user chats:", error);
      }
    };

    initializeChats();
  }, [professionalUID, dispatch]);
};

export default useInitializeUserChats;
