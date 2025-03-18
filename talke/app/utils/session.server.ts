import { createCookieSessionStorage } from "@remix-run/node";

// Session configuration
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

// Create session storage
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "talke_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

// Get user session
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// Get user data from session
export async function getUserFromSession(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  const accessToken = session.get("accessToken");
  
  if (!userId || !accessToken) {
    return null;
  }

  return {
    userId,
    accessToken,
  };
}

// Create new session
export async function createUserSession({
  userId,
  accessToken,
  redirectTo,
}: {
  userId: string;
  accessToken: string;
  redirectTo: string;
}) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  session.set("accessToken", accessToken);

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// Destroy session (logout)
export async function destroySession(request: Request) {
  const session = await getSession(request);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}