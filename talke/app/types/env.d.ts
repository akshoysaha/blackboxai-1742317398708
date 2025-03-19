/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

import type { MetaFunction as RemixMetaFunction } from '@remix-run/node';

declare global {
  interface Window {
    ENV: {
      MATRIX_SERVER_URL: string;
    };
  }
}

declare module '@remix-run/node' {
  export interface EntryContext {
    [key: string]: unknown;
  }

  export type MetaFunction = RemixMetaFunction;
}

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}