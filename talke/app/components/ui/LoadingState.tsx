import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export default function LoadingState({
  message = 'Loading...',
  fullScreen = false,
  overlay = false,
}: LoadingStateProps) {
  const theme = useTheme();

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 4,
        height: fullScreen ? '100vh' : '100%',
        width: '100%',
        position: overlay ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        bgcolor: overlay
          ? `${theme.palette.background.paper}cc`
          : theme.palette.background.default,
        zIndex: overlay ? 'modal' : 'auto',
      }}
    >
      {overlay ? (
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 4,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <CircularProgress size={48} />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            {message}
          </Typography>
        </Paper>
      ) : (
        <>
          <CircularProgress size={48} />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            {message}
          </Typography>
        </>
      )}
    </Box>
  );

  return content;
}