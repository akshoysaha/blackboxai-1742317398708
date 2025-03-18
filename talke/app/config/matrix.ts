import { createClient } from "matrix-js-sdk";

// Get Matrix homeserver URL from environment variable, fallback to localhost for development
const homeserverUrl = typeof process !== 'undefined' 
  ? process.env.MATRIX_HOMESERVER_URL || 'http://localhost:8008'
  : 'http://localhost:8008';

export const createMatrixClient = (accessToken?: string) => {
  return createClient({
    baseUrl: homeserverUrl,
    accessToken,
  });
};

export const getHomeserverUrl = () => homeserverUrl;