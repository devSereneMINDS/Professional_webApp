//import axios from "axios";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp, 
  DocumentReference, 
  DocumentSnapshot 
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// interface UnsplashPhoto {
//   urls: {
//     regular?: string;
//     full?: string;
//   };
// }

// interface UnsplashResponse {
//   [index: number]: UnsplashPhoto;
// }

interface User {
  uid: string;
  displayName?: string;
}

interface Message {
  id: number;
  text: string;
  senderId: string;
  senderName: string;
  date: number;
  isSystemMessage: boolean;
}

// export const fetchBackgroundImage = async (targetWidth: number, targetHeight: number): Promise<string | null> => {
//   try {
//     const response = await axios.get<UnsplashPhoto>("https://api.unsplash.com/photos/random", {
//       params: {
//         query: "Nature-linkedin-banner",
//         orientation: "landscape",
//         topics: "nature,garden",
//         w: targetWidth,
//         h: targetHeight,
//       },
//       headers: {
//         Authorization: `Client-ID E8if04K-dJ-8Iuq3nzF3LaGdPSnlEzJnqJdzXB7349s`,
//       },
//     });
//     // response.data is a single object for random photo, not an array
//     // So we adjust the access accordingly:
//     const photo = response.data;
//     return photo.urls.regular || photo.urls.full || null;
//   } catch (error) {
//     console.error("Error fetching background image:", error);
//     return null;
//   }
// };

export const initializeGroupChat = async (): Promise<boolean> => {
  try {
    const groupChatRef: DocumentReference = doc(db, 'groupMessages', 'group_chat');
    const docSnap: DocumentSnapshot = await getDoc(groupChatRef);
    
    if (!docSnap.exists()) {
      await setDoc(groupChatRef, {
        messages: [],
        createdAt: serverTimestamp(),
        participants: [],
        lastUpdated: serverTimestamp()
      });
      // console.log('Group chat initialized');
    }
    return true;
  } catch (error) {
    console.error('Error initializing group chat:', error);
    return false;
  }
};

export const welcomeUserToGroupChat = async (user: User): Promise<boolean> => {
  try {
    const initialized = await initializeGroupChat();
    if (!initialized) throw new Error('Failed to initialize group chat');

    const groupChatRef: DocumentReference = doc(db, 'groupMessages', 'group_chat');
    
    const welcomeMessage: Message = {
      id: Date.now(),
      text: `Welcome to the group, ${user.displayName || 'new member'}!`,
      senderId: 'system',
      senderName: 'System',
      date: Date.now(),
      isSystemMessage: true
    };

    await updateDoc(groupChatRef, {
      participants: arrayUnion(user.uid),
      messages: arrayUnion(welcomeMessage),
      lastUpdated: serverTimestamp()
    });
    
    console.log(`Welcomed ${user.displayName} to group chat`);
    return true;
  } catch (error) {
    console.error('Error welcoming user to group chat:', error);
    throw error;
  }
};
