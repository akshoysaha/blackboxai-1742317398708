import { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { Link } from '@remix-run/react';
import { useTheme as useAppTheme } from '~/components/ui/ThemeProvider';

interface LayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disablePadding?: boolean;
}

export default function Layout({
  children,
  maxWidth = 'lg',
  disablePadding = false,
}: LayoutProps) {
  const theme = useTheme();
  const { mode, toggleTheme } = useAppTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <AppBar position="sticky" elevation={1} color="default">
        <Toolbar variant="dense">
          <ChatIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Talke
          </Typography>

          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton onClick={toggleTheme} color="inherit" size="small">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {maxWidth ? (
          <Container
            maxWidth={maxWidth}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              py: disablePadding ? 0 : 3,
            }}
          >
            {children}
          </Container>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}