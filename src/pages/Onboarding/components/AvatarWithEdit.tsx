import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

interface AvatarWithEditProps {
  src: string;
  onChange: (file: File) => void;
}

export const AvatarWithEdit: React.FC<AvatarWithEditProps> = ({ src, onChange }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onChange(e.target.files[0]);
    }
    // Reset input to allow selecting same file again
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={src}
        sx={{ width: 100, height: 100, cursor: 'pointer' }}
        onClick={handleClick}
      />
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          borderRadius: '100%',
          backgroundColor: 'background.paper',
        }}
        onClick={handleClick}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        hidden
      />
    </Box>
  );
};