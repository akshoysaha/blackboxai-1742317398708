import { useEffect, useRef } from 'react';
import { Box, Typography, Avatar, Paper, useTheme } from '@mui/material';
import { format } from 'date-fns';
import type { Message } from '~/types/chat';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        height: '100%',
        overflowY: 'auto',
        bgcolor: theme.palette.background.default,
      }}
    >
      {messages.map((message) => {
        const isOwnMessage = message.sender === currentUserId;

        return (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: isOwnMessage ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <Avatar
              src={message.sender_avatar}
              alt={message.sender_name || 'User'}
              sx={{ width: 40, height: 40 }}
            />
            <Box
              sx={{
                maxWidth: '70%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
              }}
            >
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mb: 0.5 }}
              >
                {message.sender_name || 'User'} • {format(message.timestamp, 'HH:mm')}
              </Typography>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  bgcolor: isOwnMessage
                    ? theme.palette.primary.main
                    : theme.palette.background.paper,
                  color: isOwnMessage
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  borderRadius: 2,
                  ...(isOwnMessage
                    ? { borderTopRightRadius: 0 }
                    : { borderTopLeftRadius: 0 }),
                }}
              >
                {message.type === 'text' ? (
                  <Typography variant="body1">{message.content}</Typography>
                ) : message.type === 'image' ? (
                  <Box
                    component="img"
                    src={message.content}
                    alt="Image message"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 300,
                      borderRadius: 1,
                    }}
                  />
                ) : message.type === 'file' ? (
                  <Box
                    component="a"
                    href={message.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    <Typography variant="body1">
                      📎 {message.file_name || 'File'}
                      {message.file_size && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="textSecondary"
                          sx={{ ml: 1 }}
                        >
                          ({formatFileSize(message.file_size)})
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                ) : null}
              </Paper>
              {message.edited && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mt: 0.5, fontSize: '0.7rem' }}
                >
                  (edited)
                </Typography>
              )}
              {message.reactions && Object.keys(message.reactions).length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  {Object.entries(message.reactions).map(([reaction, users]) => (
                    <Typography
                      key={reaction}
                      variant="caption"
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: theme.palette.action.hover,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: theme.palette.action.selected,
                        },
                      }}
                    >
                      {reaction} {users.length}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
      <div ref={messagesEndRef} />
    </Box>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}