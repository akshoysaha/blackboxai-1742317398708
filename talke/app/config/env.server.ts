function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const ENV = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  SESSION_SECRET: getEnvVar('SESSION_SECRET', 'default-secret-change-me'),
  MATRIX_SERVER_URL: getEnvVar('MATRIX_SERVER_URL', 'https://matrix.org'),
  PORT: parseInt(getEnvVar('PORT', '3000')),
  HOST: getEnvVar('HOST', 'localhost'),
} as const;

export function getPublicEnv() {
  return {
    MATRIX_SERVER_URL: ENV.MATRIX_SERVER_URL,
  };
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      SESSION_SECRET: string;
      MATRIX_SERVER_URL: string;
      PORT?: string;
      HOST?: string;
    }
  }
}