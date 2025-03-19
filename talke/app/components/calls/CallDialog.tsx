import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Avatar,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Call as CallIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideoIcon,
  VideocamOff as VideoOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
} from '@mui/icons-material';

interface CallDialogProps {
  open: boolean;
  type: 'voice' | 'video' | 'screen';
  participantName: string;
  participantAvatar?: string;
  isIncoming?: boolean;
  onAccept?: () => void;
  onReject: () => void;
  onToggleMute?: () => void;
  onToggleVideo?: () => void;
  onToggleScreenShare?: () => void;
}

export default function CallDialog({
  open,
  type,
  participantName,
  participantAvatar,
  isIncoming = false,
  onAccept,
  onReject,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
}: CallDialogProps) {
  const theme = useTheme();
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(type === 'video');
  const [isScreenSharing, setIsScreenSharing] = useState(type === 'screen');
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (open && !isIncoming) {
      // Start duration timer
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Simulate connection delay
      setTimeout(() => {
        setIsConnecting(false);
      }, 2000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [open, isIncoming]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    onToggleMute?.();
  };

  const handleVideoToggle = () => {
    setIsVideoEnabled(!isVideoEnabled);
    onToggleVideo?.();
  };

  const handleScreenShareToggle = () => {
    setIsScreenSharing(!isScreenSharing);
    onToggleScreenShare?.();
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.default,
          backgroundImage: 'none',
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            p: 3,
          }}
        >
          {isConnecting ? (
            <CircularProgress size={60} />
          ) : (
            <Avatar
              src={participantAvatar}
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
              }}
            />
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">{participantName}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {isIncoming
                ? 'Incoming call...'
                : isConnecting
                ? 'Connecting...'
                : formatDuration(duration)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              mt: 2,
            }}
          >
            {isIncoming ? (
              <>
                <IconButton
                  onClick={onAccept}
                  sx={{
                    bgcolor: theme.palette.success.main,
                    color: theme.palette.common.white,
                    '&:hover': {
                      bgcolor: theme.palette.success.dark,
                    },
                  }}
                >
                  <CallIcon />
                </IconButton>
                <IconButton
                  onClick={onReject}
                  sx={{
                    bgcolor: theme.palette.error.main,
                    color: theme.palette.common.white,
                    '&:hover': {
                      bgcolor: theme.palette.error.dark,
                    },
                  }}
                >
                  <CallEndIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  onClick={handleMuteToggle}
                  sx={{
                    bgcolor: isMuted ? theme.palette.error.main : theme.palette.action.selected,
                    color: isMuted ? theme.palette.common.white : theme.palette.text.primary,
                    '&:hover': {
                      bgcolor: isMuted ? theme.palette.error.dark : theme.palette.action.hover,
                    },
                  }}
                >
                  {isMuted ? <MicOffIcon /> : <MicIcon />}
                </IconButton>

                {(type === 'video' || type === 'screen') && (
                  <IconButton
                    onClick={handleVideoToggle}
                    sx={{
                      bgcolor: !isVideoEnabled ? theme.palette.error.main : theme.palette.action.selected,
                      color: !isVideoEnabled ? theme.palette.common.white : theme.palette.text.primary,
                      '&:hover': {
                        bgcolor: !isVideoEnabled ? theme.palette.error.dark : theme.palette.action.hover,
                      },
                    }}
                  >
                    {isVideoEnabled ? <VideoIcon /> : <VideoOffIcon />}
                  </IconButton>
                )}

                {type === 'screen' && (
                  <IconButton
                    onClick={handleScreenShareToggle}
                    sx={{
                      bgcolor: !isScreenSharing ? theme.palette.error.main : theme.palette.action.selected,
                      color: !isScreenSharing ? theme.palette.common.white : theme.palette.text.primary,
                      '&:hover': {
                        bgcolor: !isScreenSharing ? theme.palette.error.dark : theme.palette.action.hover,
                      },
                    }}
                  >
                    {isScreenSharing ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                  </IconButton>
                )}

                <IconButton
                  onClick={onReject}
                  sx={{
                    bgcolor: theme.palette.error.main,
                    color: theme.palette.common.white,
                    '&:hover': {
                      bgcolor: theme.palette.error.dark,
                    },
                  }}
                >
                  <CallEndIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}