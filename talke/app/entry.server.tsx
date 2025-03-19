import { PassThrough } from 'stream';
import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToPipeableStream } from 'react-dom/server';
import createEmotionServer from '@emotion/server/create-instance';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';
import createEmotionCache from './styles/createEmotionCache';
import { ServerStyleContext } from './styles/server.context';
import { ThemeProvider } from './components/ui/ThemeProvider';

const ABORT_DELAY = 5000;

type ResolveFunction = (value: Response | PromiseLike<Response>) => void;
type RejectFunction = (reason?: any) => void;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
): Promise<Response> {
  return new Promise((resolve: ResolveFunction, reject: RejectFunction) => {
    let didError = false;

    // Create Emotion cache and server
    const cache: EmotionCache = createEmotionCache();
    const emotionServer = createEmotionServer(cache);

    // Create stream
    const stream = renderToPipeableStream(
      <ServerStyleContext.Provider value={null}>
        <CacheProvider value={cache}>
          <ThemeProvider>
            <RemixServer context={remixContext} url={request.url} />
          </ThemeProvider>
        </CacheProvider>
      </ServerStyleContext.Provider>,
      {
        onShellReady() {
          // Create response body
          const body = new PassThrough();

          // Set content type
          responseHeaders.set('Content-Type', 'text/html');

          // Extract critical CSS
          const { ids, css } = emotionServer.extractCritical('');

          // Create initial markup
          const markup = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><style data-emotion="${ids.join(' ')}">${css}</style></head><body><div id="root">`;

          // Create response
          resolve(
            new Response(markup, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          );

          // Pipe stream and close body
          stream.pipe(body);
          body.write('</div></body></html>');
        },

        onShellError(err: unknown) {
          reject(err);
        },

        onError(err: unknown) {
          console.error(err);
          didError = true;
        },
      }
    );

    // Set timeout
    setTimeout(() => {
      reject(new Error('Rendering timed out'));
    }, ABORT_DELAY);
  });
}
