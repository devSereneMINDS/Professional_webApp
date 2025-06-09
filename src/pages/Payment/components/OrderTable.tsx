import * as React from 'react';
import Link from '@mui/joy/Link';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { ArrowDropDownIcon } from '@mui/x-date-pickers/icons';
import Skeleton from '@mui/joy/Skeleton';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  q_and_a?: { [key: string]: string | string[] | undefined | boolean };
  ageSex: string;
  phoneNumber: string;
  email: string;
  paymentStatus: string;
  status: string;
  profileImage?: string | null;
}

interface OrderTableProps {
  clients: Client[];
  isLoading: boolean;
}

// Define mapping for gender and age group (aligned with ClientProfile)
const GENDER_MAP: { [key: string]: string } = {
  "0": "Male",
  "1": "Female",
  "2": "Other"
};

const AGE_GROUP_MAP: { [key: string]: string } = {
  "0": "Under 18",
  "1": "18-30",
  "2": "31-50",
  "3": "51+"
};

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

const SkeletonRow = () => (
  <tr>
    {[...Array(7)].map((_, index) => (
      <td key={index}>
        <Skeleton variant="text" level="body-xs" />
      </td>
    ))}
  </tr>
);

export default function OrderTable({ clients, isLoading }: OrderTableProps) {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const handleRowClick = (clientId: string, event: React.MouseEvent) => {
    if (
      (event.target as HTMLElement).closest('input[type="checkbox"]') ||
      (event.target as HTMLElement).closest('button')
    ) {
      return;
    }
    navigate(`/profile/${clientId}`);
  };

  // Helper function to safely get a string from q_and_a value
  const getStringValue = (value: string | string[] | undefined | boolean): string => {
    if (Array.isArray(value)) {
      return value[0] || ''; // Take first element if array, or empty string
    }
    if (typeof value === 'string') {
      return value;
    }
    return ''; // Fallback for undefined or boolean
  };

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
          maxWidth: "95vw"
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
              <th style={{ width: '5%', textAlign: 'center', padding: '12px 6px' }}>
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
              <th style={{ width: '15%', padding: '12px 6px' }}>
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
              <th style={{ width: '20%', padding: '12px 6px' }}>Name</th>
              <th style={{ width: '15%', padding: '12px 6px' }}>Age Group/Sex</th>
              <th style={{ width: '15%', padding: '12px 6px' }}>Phone</th>
              <th style={{ width: '20%', padding: '12px 6px' }}>Email</th>
              <th style={{ width: '10%', padding: '12px 6px' }}>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(3)].map((_, index) => <SkeletonRow key={index} />)
            ) : (
              [...clients].sort(getComparator(order, 'id')).map((client) => (
                <tr key={client.id} onClick={(e) => handleRowClick(client.id, e)}>
                  <td style={{ textAlign: 'center' }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(client.id)}
                      color={selected.includes(client.id) ? 'primary' : undefined}
                      onChange={(event) => {
                        event.stopPropagation();
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
                    <Typography level="body-xs">
                      {client.q_and_a
                        ? `${AGE_GROUP_MAP[getStringValue(client.q_and_a["age-group"])] || 'Not Available'}/${GENDER_MAP[getStringValue(client.q_and_a.gender)] || 'Not Available'}`
                        : 'Not Available'}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{client.phoneNumber}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{client.email}</Typography>
                  </td>
                  <td>
                    <Button 
                      size="sm" 
                      variant="soft" 
                      color="success"
                      sx={{ 
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 'normal'
                      }}
                    >
                      {client.paymentStatus}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Sheet>
    </React.Fragment>
  );
}
