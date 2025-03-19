import { useEffect } from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useNavigate } from '@remix-run/react';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

interface ErrorPageProps {
  status?: number;
  title?: string;
  message?: string;
  error?: Error;
  resetErrorBoundary?: () => void;
}

export default function ErrorPage({
  status = 500,
  title = 'Something went wrong',
  message = 'An unexpected error occurred.',
  error,
  resetErrorBoundary,
}: ErrorPageProps) {
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Log error to monitoring service
    if (error && process.env.NODE_ENV === 'production') {
      console.error('Error:', error);
      // TODO: Add error reporting service integration
    }
  }, [error]);

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      navigate(0); // Refresh the current page
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 4,
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
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          {status === 404 ? 'Page Not Found' : title}
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 500 }}
        >
          {status === 404
            ? "The page you're looking for doesn't exist or has been moved."
            : message}
        </Typography>

        {process.env.NODE_ENV === 'development' && error && (
          <Box
            sx={{
              p: 2,
              mb: 4,
              width: '100%',
              bgcolor: theme.palette.error.main + '11',
              borderRadius: 1,
              border: `1px solid ${theme.palette.error.main}`,
            }}
          >
            <Typography
              component="pre"
              sx={{
                color: theme.palette.error.main,
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                m: 0,
              }}
            >
              {error.stack || error.message}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleGoHome}
            sx={{ minWidth: 120 }}
          >
            Go Home
          </Button>
          {status !== 404 && (
            <Button
              variant="outlined"
              onClick={handleRetry}
              sx={{ minWidth: 120 }}
            >
              Try Again
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}