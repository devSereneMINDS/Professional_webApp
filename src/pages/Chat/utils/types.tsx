export type UserProps = {
    displayName: string;
    name: string;
    username: string;
    avatar: string;
    online: boolean;
  };
  
  export type MessageProps = {
    id: string;
    content: string;
    timestamp: string;
    unread?: boolean;
    sender: UserProps | 'You';
    senderId: string;
    date: number;
    attachment?: {
      fileName: string;
      type: string;
      size: string;
    };
  };
  
  export interface ChatProps {
    id: string;
    sender: UserProps;
    messages: MessageProps[];
    updatedAt?: number; // Add this line
  }