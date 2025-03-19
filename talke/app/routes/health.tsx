import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { ENV } from '~/config/env.server';

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  environment: string;
  version: string;
  uptime: number;
}

export const loader: LoaderFunction = async () => {
  const status: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
    version: process.env.npm_package_version || '0.1.0',
    uptime: process.uptime(),
  };

  return json(status, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
};

// This route only handles API requests, no UI needed
export default function HealthCheck() {
  return null;
}