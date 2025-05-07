/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useColorScheme } from '@mui/material/styles'; // or '@mui/joy/styles' if using Joy UI
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps, SelectChangeEvent } from '@mui/material/Select';

export default function ColorModeSelect(props: SelectProps) {
  const { mode, setMode } = useColorScheme();

  // Handle case where color scheme isn't available
  if (!mode || !setMode) {
    return null;
  }

  const handleChange = (event: SelectChangeEvent) => {
    const newMode = event.target.value as 'light' | 'dark' | 'system';
    setMode(newMode);
  };

  return (
    <Select
      value={mode}
      onChange={handleChange}
      SelectDisplayProps={{
        // @ts-ignore
        'data-screenshot': 'toggle-mode',
      }}
      {...props}
    >
      <MenuItem value="system">System</MenuItem>
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
    </Select>
  );
}
