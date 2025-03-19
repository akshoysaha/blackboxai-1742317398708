import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Typography,
  Badge,
  IconButton,
  Box,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Group as GroupIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import type { Room } from '~/types/chat';
import CreateRoomDialog from './CreateRoomDialog';

interface RoomListProps {
  rooms: Room[];
  selectedRoomId?: string;
  onRoomSelect: (roomId: string) => void;
  onCreateRoom: (name: string, isDirect: boolean, invitees: string[]) => Promise<void>;
}

export default function RoomList({
  rooms,
  selectedRoomId,
  onRoomSelect,
  onCreateRoom,
}: RoomListProps) {
  const theme = useTheme();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const sortedRooms = [...rooms].sort((a, b) => {
    // Sort by last message timestamp (most recent first)
    const timeA = a.last_message?.timestamp || 0;
    const timeB = b.last_message?.timestamp || 0;
    return timeB - timeA;
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6">Chats</Typography>
        <Tooltip title="Create new chat">
          <IconButton
            onClick={() => setIsCreateDialogOpen(true)}
            size="small"
            sx={{ color: theme.palette.primary.main }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto' }}>
        {sortedRooms.map((room) => (
          <ListItem
            key={room.id}
            disablePadding
            secondaryAction={
              room.unread_count > 0 && (
                <Badge
                  badgeContent={room.unread_count}
                  color="primary"
                  sx={{ mr: 2 }}
                />
              )
            }
          >
            <ListItemButton
              selected={room.id === selectedRoomId}
              onClick={() => onRoomSelect(room.id)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: theme.palette.action.selected,
                  '&:hover': {
                    bgcolor: theme.palette.action.selected,
                  },
                },
              }}
            >
              <ListItemAvatar>
                {room.avatar_url ? (
                  <Avatar src={room.avatar_url} alt={room.name} />
                ) : (
                  <Avatar>
                    {room.is_direct ? <PersonIcon /> : <GroupIcon />}
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: room.unread_count > 0 ? 600 : 400,
                      color: room.unread_count > 0 ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {room.name}
                  </Typography>
                }
                secondary={
                  room.last_message && (
                    <Box
                      component="span"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '150px',
                        }}
                      >
                        {room.last_message.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', flexShrink: 0 }}
                      >
                        {format(room.last_message.timestamp, 'HH:mm')}
                      </Typography>
                    </Box>
                  )
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <CreateRoomDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={onCreateRoom}
      />
    </>
  );
}