import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from '@remix-run/react';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

export default function InternalErrorPage() {
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
          color="error"
          sx={{
            fontSize: 64,
            mb: 2,
          }}
        />

        <Typography variant="h2" component="h1" gutterBottom>
          500
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          Internal Server Error
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Something went wrong on our end. Please try again later or contact support if the problem persists.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={() => window.location.reload()}
            variant="contained"
            color="primary"
          >
            Try Again
          </Button>

          <Button
            component={Link}
            to="/"
            variant="outlined"
          >
            Go Home
          </Button>
        </Box>

        {process.env.NODE_ENV === 'development' && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 4, maxWidth: '100%', overflow: 'auto' }}
          >
            Check the console and server logs for more details about this error.
          </Typography>
        )}
      </Box>
    </Container>
  );
}