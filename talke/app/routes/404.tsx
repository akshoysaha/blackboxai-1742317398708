import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from '@remix-run/react';
import { SearchOff as SearchOffIcon } from '@mui/icons-material';

export default function NotFoundPage() {
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
        <SearchOffIcon
          sx={{
            fontSize: 64,
            mb: 2,
            color: 'text.secondary',
          }}
        />

        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
          >
            Go Home
          </Button>

          <Button
            component="a"
            href="https://matrix.org/docs/projects/try-matrix-now/"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
          >
            Learn More
          </Button>
        </Box>
      </Box>
    </Container>
  );
}