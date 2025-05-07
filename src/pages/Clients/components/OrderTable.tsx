import * as React from 'react';
import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { ArrowDropDownIcon } from '@mui/x-date-pickers/icons';

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

interface OrderTableProps {
  clients: Client[];
  isLoading: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<T>(order: Order, orderBy: keyof T): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
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
        <MenuItem color="danger">Ban</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function OrderTable({ clients, isLoading }: OrderTableProps) {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  // const [open, setOpen] = React.useState(false);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading clients...</Typography>
      </Box>
    );
  }

  return (
    <React.Fragment>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
          maxWidth:"95vw"
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== clients.length
                  }
                  checked={selected.length === clients.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? clients.map((client) => client.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === clients.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 80, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={[
                    {
                      fontWeight: 'lg',
                      '& svg': {
                        transition: '0.2s',
                        transform:
                          order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                      },
                    },
                    order === 'desc'
                      ? { '& svg': { transform: 'rotate(0deg)' } }
                      : { '& svg': { transform: 'rotate(180deg)' } },
                  ]}
                >
                  ID
                </Link>
              </th>
              <th style={{ width: 160, padding: '12px 6px' }}>Name</th>
              <th style={{ width: 120, padding: '12px 6px' }}>Age Group/Sex</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Phone</th>
              <th style={{ width: 200, padding: '12px 6px' }}>Email</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Issue</th>
              <th style={{ width: 80, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {[...clients].sort(getComparator(order, 'id')).map((client) => (
              <tr key={client.id}>
                <td style={{ textAlign: 'center' }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(client.id)}
                    color={selected.includes(client.id) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(client.id)
                          : ids.filter((itemId) => itemId !== client.id),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>
                <td>
                  <Typography level="body-xs">{client.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{client.name}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{client.ageSex }</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{client.phoneNumber}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{client.email}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{client.diagnosis}</Typography>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <RowMenu />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      {/* Pagination and other components remain the same */}
    </React.Fragment>
  );
}