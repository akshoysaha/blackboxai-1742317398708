import createCache from '@emotion/cache';
import type { EmotionCache } from '@emotion/cache';

export default function createEmotionCache(): EmotionCache {
  return createCache({
    key: 'css',
    prepend: true // This ensures styles are prepended to the <head>, which is better for SSR
  });
}