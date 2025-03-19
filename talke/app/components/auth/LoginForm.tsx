import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { Form, Link as RemixLink, useNavigation } from '@remix-run/react';

interface LoginFormProps {
  error?: string;
  redirectTo?: string;
}

export default function LoginForm({ error, redirectTo }: LoginFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isValid = username.trim() && password.trim();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Welcome to Talke
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Form method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={redirectTo || '/chat'}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              fullWidth
              disabled={isSubmitting}
              placeholder="@username:matrix.org"
              helperText="Enter your Matrix username"
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              fullWidth
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isValid || isSubmitting}
              sx={{ mt: 1 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </Form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component={RemixLink}
              to="/register"
              color="primary"
              underline="hover"
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}