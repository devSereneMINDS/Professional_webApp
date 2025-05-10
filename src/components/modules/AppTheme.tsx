/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
  ThemeProvider as MaterialThemeProvider,
  createTheme, // Replace experimental_extendTheme with createTheme
  CssVarsProvider as MaterialCssVarsProvider,
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
      const defaultMuiTheme = createTheme();
      const defaultJoyTheme = extendJoyTheme();
      return {
        muiTheme: defaultMuiTheme,
        joyTheme: defaultJoyTheme,
      };
    }

    // Transform color schemes to match MUI's expected format
    const transformedColorSchemes = {
      light: {
        palette: {
          primary: {
            main: colorSchemes.light.palette.primary.main,
            light: colorSchemes.light.palette.primary.light,
            dark: colorSchemes.light.palette.primary.dark,
            contrastText: colorSchemes.light.palette.primary.contrastText,
          },
          background: {
            default: colorSchemes.light.palette.background?.default || '#ffffff',
            paper: colorSchemes.light.palette.background?.paper || '#f5f5f5',
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: colorSchemes.dark.palette.primary.main,
            light: colorSchemes.dark.palette.primary.light,
            dark: colorSchemes.dark.palette.primary.dark,
            contrastText: colorSchemes.dark.palette.primary.contrastText,
          },
          background: {
            default: colorSchemes.dark.palette.background?.default || '#121212',
            paper: colorSchemes.dark.palette.background?.paper || '#1e1e1e',
          },
        },
      },
    };

    const muiTheme = createTheme({
      colorSchemes: transformedColorSchemes,
      shape,
      typography,
      breakpoints,
      shadows,
      components: {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
      },
    }) as any; // Cast to 'any' to bypass type issues temporarily

    const joyTheme = extendJoyTheme({
      typography,
      breakpoints,
    });

    return { muiTheme, joyTheme };
  }, [disableCustomTheme]);

  return (
    <MaterialCssVarsProvider
      defaultMode="light"
      theme={muiTheme}
    >
      <JoyCssVarsProvider theme={joyTheme}>
        <MaterialThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme />
          {children}
        </MaterialThemeProvider>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}