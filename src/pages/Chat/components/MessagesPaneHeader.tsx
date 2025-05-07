import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Menu, MenuItem } from '@mui/joy';
import { useSelector } from 'react-redux';

export default function MessagesPaneHeader() {
  const { user } = useSelector((state: any) => state.userChat);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.body',
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1, md: 2 }}
        sx={{ alignItems: 'center' }}
      >
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>

        <Avatar size="lg" src={user?.photoURL || ''} />

        <div>
          <Typography
            component="h2"
            noWrap
            endDecorator={
              user?.isOnline ? (
                <Chip
                  variant="outlined"
                  size="sm"
                  color="neutral"
                  sx={{ borderRadius: 'sm' }}
                  startDecorator={
                    <CircleIcon sx={{ fontSize: 8 }} color="success" />
                  }
                  slotProps={{ root: { component: 'span' } }}
                >
                  Online
                </Chip>
              ) : undefined
            }
            sx={{ fontWeight: 'lg', fontSize: 'lg' }}
          >
            {user?.displayName || 'Unknown User'}
          </Typography>
          <Typography level="body-sm">{user?.email || 'No email available'}</Typography>
        </div>
      </Stack>

      <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          onClick={handleClick}
        >
          <MoreVertRoundedIcon />
        </IconButton>

        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleClose}
          placement="bottom-end"
        >
          <MenuItem onClick={handleClose}>Book Appointment</MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
}