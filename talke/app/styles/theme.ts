import { ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#2196f3' : '#90caf9',
      light: mode === 'light' ? '#64b5f6' : '#b3e5fc',
      dark: mode === 'light' ? '#1976d2' : '#42a5f5',
      contrastText: mode === 'light' ? '#fff' : '#000',
    },
    secondary: {
      main: mode === 'light' ? '#f50057' : '#f48fb1',
      light: mode === 'light' ? '#ff4081' : '#f8bbd0',
      dark: mode === 'light' ? '#c51162' : '#ec407a',
      contrastText: mode === 'light' ? '#fff' : '#000',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#fff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#fff',
      secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
    },
    divider: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export const getTheme = (mode: PaletteMode): ThemeOptions => ({
  ...getDesignTokens(mode),
  status: {
    danger: mode === 'light' ? '#f44336' : '#ef5350',
  },
});

export const lightTheme = getTheme('light');
export const darkTheme = getTheme('dark');