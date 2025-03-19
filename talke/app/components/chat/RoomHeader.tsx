import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  ExitToApp as LeaveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import type { Room } from '~/types/chat';

interface RoomHeaderProps {
  room: Room;
  onLeaveRoom: () => Promise<void>;
  onDeleteRoom: () => Promise<void>;
  onEditRoom?: () => void;
  onViewInfo?: () => void;
}

export default function RoomHeader({
  room,
  onLeaveRoom,
  onDeleteRoom,
  onEditRoom,
  onViewInfo,
}: RoomHeaderProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = async (action: () => Promise<void>) => {
    try {
      setIsLoading(true);
      await action();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
      handleMenuClose();
    }
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar variant="dense">
        <Avatar
          src={room.avatar_url}
          sx={{ width: 40, height: 40, mr: 2 }}
        >
          {room.is_direct ? <PersonIcon /> : <GroupIcon />}
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" component="div" noWrap>
            {room.name}
          </Typography>
          {room.topic && (
            <Typography
              variant="caption"
              color="textSecondary"
              component="div"
              noWrap
            >
              {room.topic}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {room.members && (
            <Tooltip title={`${room.members.length} members`}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon
                  fontSize="small"
                  sx={{ mr: 0.5, color: 'text.secondary' }}
                />
                <Typography variant="caption" color="textSecondary">
                  {room.members.length}
                </Typography>
              </Box>
            </Tooltip>
          )}

          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            disabled={isLoading}
          >
            <MoreIcon />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {onViewInfo && (
            <MenuItem onClick={() => {
              onViewInfo();
              handleMenuClose();
            }}>
              <ListItemIcon>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Room Info</ListItemText>
            </MenuItem>
          )}

          {onEditRoom && (
            <MenuItem onClick={() => {
              onEditRoom();
              handleMenuClose();
            }}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Room</ListItemText>
            </MenuItem>
          )}

          <MenuItem
            onClick={() => handleAction(onLeaveRoom)}
            disabled={isLoading}
          >
            <ListItemIcon>
              <LeaveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Leave Room</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => handleAction(onDeleteRoom)}
            disabled={isLoading}
            sx={{ color: theme.palette.error.main }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete Room</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}