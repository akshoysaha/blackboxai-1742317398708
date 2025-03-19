import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { MATRIX_CONSTANTS } from '~/config/matrix';
import type { MatrixError } from '~/types/chat';

// Configure session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__matrix_session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET || 'default-secret'],
    secure: process.env.NODE_ENV === 'production',
  },
});

// Session data type
interface SessionData {
  accessToken: string;
  userId: string;
  deviceId: string;
  homeServer: string;
}

// Get session from request
export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

// Get user data from session
export async function getUserFromSession(request: Request): Promise<SessionData | null> {
  const session = await getSession(request);
  const accessToken = session.get('accessToken');
  const userId = session.get('userId');
  const deviceId = session.get('deviceId');
  const homeServer = session.get('homeServer');

  if (!accessToken || !userId || !deviceId || !homeServer) {
    return null;
  }

  return {
    accessToken,
    userId,
    deviceId,
    homeServer,
  };
}

// Create new session
export async function createUserSession({
  accessToken,
  userId,
  deviceId,
  homeServer,
  redirectTo,
}: SessionData & { redirectTo: string }) {
  const session = await sessionStorage.getSession();
  session.set('accessToken', accessToken);
  session.set('userId', userId);
  session.set('deviceId', deviceId);
  session.set('homeServer', homeServer);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

// Destroy session
export async function destroyUserSession(request: Request) {
  const session = await getSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}

// Require user session
export async function requireUser(request: Request) {
  const user = await getUserFromSession(request);

  if (!user) {
    throw redirect('/login');
  }

  return user;
}

// Handle Matrix errors
export function handleMatrixError(error: MatrixError) {
  switch (error.errcode) {
    case MATRIX_CONSTANTS.ERROR_CODES.UNKNOWN_TOKEN:
    case MATRIX_CONSTANTS.ERROR_CODES.MISSING_TOKEN:
      throw redirect('/login');
    
    case MATRIX_CONSTANTS.ERROR_CODES.FORBIDDEN:
      throw new Response('Forbidden', { status: 403 });
    
    case MATRIX_CONSTANTS.ERROR_CODES.NOT_FOUND:
      throw new Response('Not Found', { status: 404 });
    
    case MATRIX_CONSTANTS.ERROR_CODES.LIMIT_EXCEEDED:
      throw new Response('Rate Limit Exceeded', { status: 429 });
    
    default:
      throw new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}

// Validate session
export async function validateSession(request: Request) {
  const user = await getUserFromSession(request);

  if (!user) {
    return null;
  }

  try {
    // You might want to add a lightweight Matrix API call here to validate the token
    // For example, checking the user's presence or getting a sync token
    return user;
  } catch (error) {
    if ((error as MatrixError).errcode === MATRIX_CONSTANTS.ERROR_CODES.UNKNOWN_TOKEN) {
      await destroyUserSession(request);
      return null;
    }
    throw error;
  }
}