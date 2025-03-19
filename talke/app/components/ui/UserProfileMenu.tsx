import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { Form } from '@remix-run/react';
import { useTheme as useAppTheme } from './ThemeProvider';

interface UserProfileMenuProps {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

export default function UserProfileMenu({
  userId,
  displayName,
  avatarUrl,
  onSettingsClick,
  onProfileClick,
}: UserProfileMenuProps) {
  const theme = useTheme();
  const { mode, toggleTheme } = useAppTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    handleClose();
    action();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ padding: 0.5 }}
      >
        <Avatar
          src={avatarUrl}
          alt={displayName}
          sx={{
            width: 40,
            height: 40,
            bgcolor: theme.palette.primary.main,
          }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 220,
            mt: 1,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" noWrap>
            {displayName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {userId}
          </Typography>
        </Box>

        <Divider />

        {onProfileClick && (
          <MenuItem onClick={() => handleAction(onProfileClick)}>
            <ListItemIcon>
              <AccountIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
        )}

        {onSettingsClick && (
          <MenuItem onClick={() => handleAction(onSettingsClick)}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => handleAction(toggleTheme)}>
          <ListItemIcon>
            {mode === 'dark' ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </ListItemText>
        </MenuItem>

        <Divider />

        <Form action="/logout" method="post">
          <MenuItem
            onClick={handleClose}
            component="button"
            type="submit"
            sx={{
              width: '100%',
              color: theme.palette.error.main,
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Form>
      </Menu>
    </>
  );
}