import { useState } from 'react';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { matrixService } from '~/services/matrix.server';
import { createUserSession, getUserFromSession } from '~/utils/session.server';
import Layout from '~/components/ui/Layout';

interface ActionData {
  error?: string;
  fields?: {
    username: string;
    homeserver: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username')?.toString();
  const password = form.get('password')?.toString();
  const homeserver = form.get('homeserver')?.toString() || '';

  if (!username || !password) {
    return json<ActionData>(
      {
        error: 'Please provide both username and password',
        fields: { username: username || '', homeserver },
      },
      { status: 400 }
    );
  }

  try {
    const response = await matrixService.login(username, password);

    return createUserSession({
      accessToken: response.accessToken,
      userId: response.userId,
      deviceId: response.deviceId,
      homeServer: response.homeServer,
      redirectTo: '/chat',
    });
  } catch (error) {
    console.error('Login error:', error);
    return json<ActionData>(
      {
        error: 'Invalid username or password',
        fields: { username, homeserver },
      },
      { status: 401 }
    );
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);
  if (user) {
    return redirect('/chat');
  }
  return json({});
};

export default function LoginPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Layout maxWidth="sm">
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome to Talke
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Sign in to your Matrix account to continue
          </Typography>

          <Form method="post">
            {actionData?.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {actionData.error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Username"
              name="username"
              autoComplete="username"
              defaultValue={actionData?.fields?.username}
              disabled={isSubmitting}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              name="password"
              autoComplete="current-password"
              disabled={isSubmitting}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ mb: 2 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              Don't have an account?{' '}
              <Link
                href="https://matrix.org/docs/projects/try-matrix-now/"
                target="_blank"
                rel="noopener"
              >
                Get started with Matrix
              </Link>
            </Typography>
          </Form>
        </Paper>
      </Box>
    </Layout>
  );
}