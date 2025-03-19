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

interface RegisterFormProps {
  error?: string;
  redirectTo?: string;
}

export default function RegisterForm({ error, redirectTo }: RegisterFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValid = 
    username.trim() && 
    password.trim() && 
    confirmPassword.trim() && 
    password === confirmPassword;

  const getPasswordError = () => {
    if (!password) return '';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (confirmPassword && password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

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
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign up for Talke
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
              helperText="Choose your Matrix username"
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              fullWidth
              disabled={isSubmitting}
              error={!!getPasswordError()}
              helperText={getPasswordError() || 'At least 8 characters'}
            />

            <TextField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              fullWidth
              disabled={isSubmitting}
              error={confirmPassword !== '' && password !== confirmPassword}
              helperText={
                confirmPassword !== '' && password !== confirmPassword
                  ? 'Passwords do not match'
                  : ' '
              }
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
                'Sign Up'
              )}
            </Button>
          </Box>
        </Form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              component={RemixLink}
              to="/login"
              color="primary"
              underline="hover"
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}