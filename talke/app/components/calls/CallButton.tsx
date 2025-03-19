import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Call as CallIcon,
  Videocam as VideoIcon,
  ScreenShare as ScreenShareIcon,
} from '@mui/icons-material';

interface CallButtonProps {
  onVoiceCall: () => void;
  onVideoCall: () => void;
  onScreenShare: () => void;
  disabled?: boolean;
}

export default function CallButton({
  onVoiceCall,
  onVideoCall,
  onScreenShare,
  disabled = false,
}: CallButtonProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCallType = (type: 'voice' | 'video' | 'screen') => {
    handleClose();
    switch (type) {
      case 'voice':
        onVoiceCall();
        break;
      case 'video':
        onVideoCall();
        break;
      case 'screen':
        onScreenShare();
        break;
    }
  };

  return (
    <>
      <Tooltip title="Start call">
        <span>
          <IconButton
            onClick={handleClick}
            disabled={disabled}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <CallIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleCallType('voice')}>
          <ListItemIcon>
            <CallIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voice Call</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleCallType('video')}>
          <ListItemIcon>
            <VideoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Video Call</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleCallType('screen')}>
          <ListItemIcon>
            <ScreenShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share Screen</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}