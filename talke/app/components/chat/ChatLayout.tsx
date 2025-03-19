import { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';
import type { Room, Message } from '~/types/chat';
import RoomList from './RoomList';
import RoomHeader from './RoomHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatLayoutProps {
  rooms: Room[];
  selectedRoom?: Room;
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  onRoomSelect: (roomId: string) => void;
  onCreateRoom: (name: string, isDirect: boolean, invitees: string[]) => Promise<void>;
  onSendMessage: (content: string, type: 'text' | 'file', file?: File) => Promise<void>;
  onLeaveRoom: () => Promise<void>;
  onDeleteRoom: () => Promise<void>;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  sidebar?: ReactNode;
}

export default function ChatLayout({
  rooms,
  selectedRoom,
  messages,
  currentUserId,
  isLoading,
  onRoomSelect,
  onCreateRoom,
  onSendMessage,
  onLeaveRoom,
  onDeleteRoom,
  onTypingStart,
  onTypingStop,
  sidebar,
}: ChatLayoutProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Room List */}
      <Box
        sx={{
          width: 320,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <RoomList
          rooms={rooms}
          selectedRoomId={selectedRoom?.id}
          onRoomSelect={onRoomSelect}
          onCreateRoom={onCreateRoom}
        />
      </Box>

      {/* Chat Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {selectedRoom ? (
          <>
            <RoomHeader
              room={selectedRoom}
              onLeaveRoom={onLeaveRoom}
              onDeleteRoom={onDeleteRoom}
            />
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <MessageList
                messages={messages}
                currentUserId={currentUserId}
              />
              <MessageInput
                onSendMessage={onSendMessage}
                onTypingStart={onTypingStart}
                onTypingStop={onTypingStop}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: theme.palette.text.secondary,
            }}
          >
            Select a room to start chatting
          </Box>
        )}
      </Box>

      {/* Optional Sidebar */}
      {sidebar && (
        <Box
          sx={{
            width: 280,
            borderLeft: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          }}
        >
          {sidebar}
        </Box>
      )}
    </Box>
  );
}