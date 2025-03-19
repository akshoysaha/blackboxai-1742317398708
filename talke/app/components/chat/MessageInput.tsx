import { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  InsertEmoticon as EmojiIcon,
} from '@mui/icons-material';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'file', file?: File) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

export default function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
}: MessageInputProps) {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTypingStart?.();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTypingStop?.();
    }, 1000);
  };

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    handleTyping();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
      setIsTyping(false);
      onTypingStop?.();
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSendMessage('', 'file', file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        component="form"
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />
        <Tooltip title="Attach file">
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            size="small"
            sx={{ color: theme.palette.text.secondary }}
          >
            <AttachFileIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add emoji">
          <IconButton
            size="small"
            sx={{ color: theme.palette.text.secondary }}
          >
            <EmojiIcon />
          </IconButton>
        </Tooltip>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          variant="outlined"
          size="small"
          InputProps={{
            sx: {
              bgcolor: theme.palette.background.default,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            },
            endAdornment: message.trim() && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSendMessage}
                  size="small"
                  sx={{ color: theme.palette.primary.main }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}