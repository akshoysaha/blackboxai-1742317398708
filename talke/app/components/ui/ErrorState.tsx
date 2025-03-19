import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error;
  fullScreen?: boolean;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while processing your request.',
  error,
  fullScreen = false,
  onRetry,
}: ErrorStateProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: fullScreen ? '100vh' : '100%',
        p: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <ErrorIcon
          sx={{
            fontSize: 64,
            color: theme.palette.error.main,
            mb: 2,
          }}
        />

        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', mb: 2 }}
        >
          {message}
        </Typography>

        {error && process.env.NODE_ENV === 'development' && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              width: '100%',
              bgcolor: theme.palette.error.main + '11',
              borderColor: theme.palette.error.main,
              overflowX: 'auto',
            }}
          >
            <Typography
              variant="caption"
              component="pre"
              sx={{
                fontFamily: 'monospace',
                color: theme.palette.error.main,
                m: 0,
              }}
            >
              {error.stack || error.message}
            </Typography>
          </Paper>
        )}

        {onRetry && (
          <Button
            variant="contained"
            onClick={onRetry}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        )}
      </Paper>
    </Box>
  );
}