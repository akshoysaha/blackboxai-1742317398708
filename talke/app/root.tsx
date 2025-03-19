import { useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from '@remix-run/react';
import { withEmotionCache } from '@emotion/react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material';
import { ThemeProvider } from '~/components/ui/ThemeProvider';
import ClientStyleContext from '~/styles/client.context';

export const meta: MetaFunction = () => {
  return [
    { title: 'Talke - Matrix Chat Client' },
    { name: 'description', content: 'A modern Matrix chat client built with Remix and Material UI' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
    { name: 'theme-color', content: '#2196f3' },
  ];
};

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = { reset: () => {} };
    const location = useLocation();

    useEnhancedEffect(() => {
      emotionCache.sheet.container = document.head;
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      clientStyleData.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          />
          <meta name="emotion-insertion-point" content="" />
        </head>
        <body>
          <ClientStyleContext.Provider value={clientStyleData}>
            <ThemeProvider>{children}</ThemeProvider>
          </ClientStyleContext.Provider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

// Handle errors gracefully
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1>App Error</h1>
        <pre>{error.message}</pre>
        <p>
          <a href="/" style={{ textDecoration: 'underline' }}>
            Try again
          </a>
        </p>
      </div>
    </Document>
  );
}

// Handle caught errors (like 404s)
export function CatchBoundary() {
  return (
    <Document title="Error!">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p>
          <a href="/" style={{ textDecoration: 'underline' }}>
            Go home
          </a>
        </p>
      </div>
    </Document>
  );
}
