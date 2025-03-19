declare module '@emotion/server/create-instance' {
  import { EmotionCache } from '@emotion/cache';

  interface EmotionCritical {
    html: string;
    ids: Array<string>;
    css: string;
  }

  interface EmotionServer {
    extractCritical(html: string): EmotionCritical;
    extractCriticalToChunks(html: string): {
      html: string;
      styles: Array<{
        key: string;
        ids: Array<string>;
        css: string;
      }>;
    };
    renderStylesToString(html: string): string;
    renderStylesToNodeStream(): NodeJS.ReadWriteStream;
  }

  export default function createEmotionServer(cache: EmotionCache): EmotionServer;
}