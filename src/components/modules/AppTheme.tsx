import * as React from 'react';
import {
  createTheme as extendMuiTheme,
  ThemeProvider as MaterialThemeProvider,
  CssVarsProvider as MaterialCssVarsProvider,
  createTheme as createMuiBaseTheme,
} from '@mui/material/styles';
import {
  CssVarsProvider as JoyCssVarsProvider,
  extendTheme as extendJoyTheme,
} from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import component customizations and primitives
import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surface';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';

// Explicit breakpoint configuration
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
}

export default function AppTheme({
  children,
  disableCustomTheme = false,
}: AppThemeProps) {
  const { muiTheme, joyTheme } = React.useMemo(() => {
    if (disableCustomTheme) {
      const defaultMuiTheme = createMuiBaseTheme();
      const defaultJoyTheme = extendJoyTheme();
      return {
        muiTheme: defaultMuiTheme,
        joyTheme: defaultJoyTheme,
      };
    }

    const muiTheme = extendMuiTheme({
      colorSchemes,
      cssVarPrefix: 'template',
      shape,
      typography,
      breakpoints, // Explicitly set breakpoints
      shadows,
      components: {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
      },
    });

    const joyTheme = extendJoyTheme({
      colorSchemes,
      cssVarPrefix: 'template',
      typography,
      breakpoints, // Explicitly set breakpoints
    });

    return { muiTheme, joyTheme };
  }, [disableCustomTheme]);

  return (
    <MaterialCssVarsProvider theme={muiTheme}>
      <JoyCssVarsProvider theme={joyTheme}>
        <MaterialThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme />
          {children}
        </MaterialThemeProvider>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}