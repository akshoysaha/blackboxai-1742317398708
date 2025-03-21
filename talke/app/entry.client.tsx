import { useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import { RemixBrowser } from '@remix-run/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ClientStyleContext from './styles/client.context';
import createEmotionCache from './styles/createEmotionCache';

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

hydrateRoot(
  document,
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>
);
