import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { MessageProps } from '../utils/types';
import { db } from '../../../../firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux';

type ChatBubbleProps = MessageProps & {
  variant: 'sent' | 'received';
  chatId: string;
  messageId: string;
};

export default function ChatBubble(props: ChatBubbleProps) {
  const { 
    content, 
    variant, 
    timestamp, 
    attachment = undefined, 
    // sender, 
    // chatId, 
    messageId 
  } = props;
  const { chatId, user } = useSelector((state: any) => state.userChat);
  const currentUserId = useSelector((state: any) => state.user?.id);
  const isSent = variant === 'sent';
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [reactions, setReactions] = React.useState<{
    likes: string[];
    celebrations: string[];
  }>({ likes: [], celebrations: [] });

  console.log("user is is ",user)

  // Listen for real-time updates to message reactions
  React.useEffect(() => {
    if (!chatId || !messageId) return;

    const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
    const unsubscribe = onSnapshot(messageRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setReactions({
          likes: data?.likes || [],
          celebrations: data?.celebrations || []
        });
      }
    });

    return () => unsubscribe();
  }, [chatId, messageId]);

  const isLiked = reactions.likes.includes(currentUserId);
  const isCelebrated = reactions.celebrations.includes(currentUserId);

  const handleReaction = async (type: 'like' | 'celebration') => {
    if (!chatId || !messageId || !currentUserId) return;

    const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
    const reactionField = type === 'like' ? 'likes' : 'celebrations';
    const isReacted = type === 'like' ? isLiked : isCelebrated;

    try {
      if (isReacted) {
        await updateDoc(messageRef, {
          [reactionField]: arrayRemove(currentUserId)
        });
      } else {
        await updateDoc(messageRef, {
          [reactionField]: arrayUnion(currentUserId)
        });
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  // const formatTimestamp = (timestamp: any) => {
  //   if (!timestamp) return '';
    
  //   const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  //   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // };

  return (
    <Box sx={{ maxWidth: '60%', minWidth: 'auto' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: 'space-between', mb: 0.25 }}
      >
        <Typography level="body-xs">
        {isSent ? "Me" : user?.displayName}
        </Typography>
        <Typography level="body-xs">{timestamp}</Typography>
      </Stack>
      {attachment ? (
        <Sheet
          variant="outlined"
          sx={[
            {
              px: 1.75,
              py: 1.25,
              borderRadius: 'lg',
            },
            isSent ? { borderTopRightRadius: 0 } : { borderTopRightRadius: 'lg' },
            isSent ? { borderTopLeftRadius: 'lg' } : { borderTopLeftRadius: 0 },
          ]}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Avatar color="primary" size="lg">
              <InsertDriveFileRoundedIcon />
            </Avatar>
            <div>
              <Typography sx={{ fontSize: 'sm' }}>{attachment.fileName}</Typography>
              <Typography level="body-sm">{attachment.size}</Typography>
            </div>
          </Stack>
        </Sheet>
      ) : (
        <Box
          sx={{ position: 'relative' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Sheet
            color={isSent ? 'primary' : 'neutral'}
            variant={isSent ? 'solid' : 'soft'}
            sx={[
              {
                p: 1.25,
                borderRadius: 'lg',
              },
              isSent
                ? {
                    borderTopRightRadius: 0,
                  }
                : {
                    borderTopRightRadius: 'lg',
                  },
              isSent
                ? {
                    borderTopLeftRadius: 'lg',
                  }
                : {
                    borderTopLeftRadius: 0,
                  },
              isSent
                ? {
                    backgroundColor: 'var(--joy-palette-primary-solidBg)',
                  }
                : {
                    backgroundColor: 'background.body',
                  },
            ]}
          >
            <Typography
              level="body-sm"
              sx={[
                isSent
                  ? {
                      color: 'var(--joy-palette-common-white)',
                    }
                  : {
                      color: 'var(--joy-palette-text-primary)',
                    },
              ]}
            >
              {content}
            </Typography>
          </Sheet>
          {(isHovered || isLiked || isCelebrated) && (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                justifyContent: isSent ? 'flex-end' : 'flex-start',
                position: 'absolute',
                top: '50%',
                p: 1.5,
              }}
            >
              <IconButton
                variant={isLiked ? 'soft' : 'plain'}
                color={isLiked ? 'danger' : 'neutral'}
                size="sm"
                onClick={() => handleReaction('like')}
              >
                {isLiked ? '❤️' : <FavoriteBorderIcon />}
                {reactions.likes.length > 0 && (
                  <Typography level="body-xs" sx={{ ml: 0.5 }}>
                    {reactions.likes.length}
                  </Typography>
                )}
              </IconButton>
              <IconButton
                variant={isCelebrated ? 'soft' : 'plain'}
                color={isCelebrated ? 'warning' : 'neutral'}
                size="sm"
                onClick={() => handleReaction('celebration')}
              >
                {isCelebrated ? '🎉' : <CelebrationOutlinedIcon />}
                {reactions.celebrations.length > 0 && (
                  <Typography level="body-xs" sx={{ ml: 0.5 }}>
                    {reactions.celebrations.length}
                  </Typography>
                )}
              </IconButton>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}