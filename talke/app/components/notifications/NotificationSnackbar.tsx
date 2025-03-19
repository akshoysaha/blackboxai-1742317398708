import { forwardRef } from 'react';
import {
  Snackbar,
  Alert as MuiAlert,
  AlertProps,
  Typography,
  Box,
} from '@mui/material';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  details?: string;
  onClose: () => void;
  autoHideDuration?: number;
}

export default function NotificationSnackbar({
  open,
  message,
  type = 'info',
  details,
  onClose,
  autoHideDuration = 6000,
}: NotificationSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={type}
        sx={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" fontWeight="medium">
            {message}
          </Typography>
          {details && (
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                opacity: 0.8,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {details}
            </Typography>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
}