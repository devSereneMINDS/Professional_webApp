import { ColorPaletteProp } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import BlockIcon from '@mui/icons-material/Block';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Skeleton from '@mui/joy/Skeleton';
import React from 'react';
import { Stack } from '@mui/joy';

interface Client {
  id: string;
  name: string;
  ageSex: string;
  phoneNumber: string;
  email: string;
  diagnosis: string;
  status: string;
  profileImage?: string | null;
}

interface OrderListProps {
  clients: Client[];
  isLoading: boolean;
}



function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Reschedule</MenuItem>
        <Divider />
        <MenuItem color="danger">Cancel</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function OrderList({ clients, isLoading }: OrderListProps) {
  // Skeleton loading state
  if (isLoading) {
    return (
      <Stack sx={{ 
        display: { xs: 'block', sm: 'none' },
        height: 'calc(100vh - 200px)',
        overflow: 'auto',
        p: 1
      }}>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ mb: 2, p: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" level="body-sm" />
                <Skeleton variant="text" width="80%" level="body-sm" />
                <Skeleton variant="text" width="50%" level="body-sm" />
                <Skeleton variant="text" width="70%" level="body-sm" />
              </Box>
            </Box>
            <ListDivider sx={{ my: 1 }} />
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Stack sx={{ 
      display: { xs: 'block', sm: 'none' },
      height: 'calc(100vh - 200px)',
      overflow: 'auto',
      p: 1
    }}>
      <List size="sm" sx={{ '--ListItem-paddingX': 0 }}>
        {clients.map((client) => (
          <React.Fragment key={client.id}>
            <ListItem
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'flex-start',
                gap: 1.5,
                p: 2,
                borderRadius: 'sm',
                '&:hover': {
                  backgroundColor: 'background.level1',
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                width: '100%',
                alignItems: 'flex-start',
                gap: 2 
              }}>
                <ListItemDecorator>
                  <Avatar size="sm" src={client.profileImage || undefined}>
                    {client.name.charAt(0)}
                  </Avatar>
                </ListItemDecorator>
                
                <ListItemContent sx={{ flex: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 1
                  }}>
                    <Typography level="title-sm" sx={{ fontWeight: 600 }}>
                      {client.name}
                    </Typography>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        {
                          Banned: <BlockIcon fontSize="small" />,
                        }[client.status]
                      }
                      color={
                        {
                          Confirmed: 'success',
                          Pending: 'neutral',
                          Cancelled: 'danger',
                        }[client.status] as ColorPaletteProp
                      }
                      sx={{ 
                        alignSelf: 'flex-start',
                        fontSize: '0.75rem'
                      }}
                    >
                      {client.status}
                    </Chip>
                  </Box>
                  
                  <Typography level="body-xs" sx={{ mb: 1 }}>
                    {client.email}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 1
                  }}>
                    <Typography level="body-xs">
                      {client.phoneNumber}
                    </Typography>
                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                      •
                    </Typography>
                    <Typography level="body-xs">
                      {client.ageSex}
                    </Typography>
                  </Box>
                  
                  <Typography level="body-xs" sx={{ mb: 1.5 }}>
                    <Box component="span" sx={{ fontWeight: 600 }}>Issue:</Box> {client.diagnosis}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Link 
                      level="body-xs" 
                      component="button"
                      sx={{ fontWeight: 600 }}
                    >
                      View Details
                    </Link>
                    <RowMenu />
                  </Box>
                </ListItemContent>
              </Box>
            </ListItem>
            <ListDivider sx={{ mx: 2 }} />
          </React.Fragment>
        ))}
      </List>
      
      {/* Pagination - Mobile */}
      {clients.length > 0 && (
        <Box
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 2,
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'background.body'
          }}
        >
          <IconButton
            aria-label="previous page"
            variant="outlined"
            color="neutral"
            size="sm"
            disabled
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <Typography level="body-sm" sx={{ mx: 'auto', px: 2 }}>
            Page 1 of {Math.ceil(clients.length / 10)}
          </Typography>
          <IconButton
            aria-label="next page"
            variant="outlined"
            color="neutral"
            size="sm"
            disabled={clients.length <= 10}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      )}
    </Stack>
  );
}