import { describe, it, expect } from 'vitest';
import { MATRIX_CONSTANTS } from './matrix';

describe('Matrix Configuration', () => {
  it('should have required constants', () => {
    expect(MATRIX_CONSTANTS).toBeDefined();
    expect(MATRIX_CONSTANTS.HOMESERVER_URL).toBeDefined();
    expect(MATRIX_CONSTANTS.HOMESERVER_URL).toMatch(/^https?:\/\//);
  });

  it('should have error codes defined', () => {
    expect(MATRIX_CONSTANTS.ERROR_CODES).toBeDefined();
    expect(MATRIX_CONSTANTS.ERROR_CODES.UNKNOWN_TOKEN).toBe('M_UNKNOWN_TOKEN');
    expect(MATRIX_CONSTANTS.ERROR_CODES.MISSING_TOKEN).toBe('M_MISSING_TOKEN');
    expect(MATRIX_CONSTANTS.ERROR_CODES.FORBIDDEN).toBe('M_FORBIDDEN');
  });

  it('should have room presets defined', () => {
    expect(MATRIX_CONSTANTS.PRESET).toBeDefined();
    expect(MATRIX_CONSTANTS.PRESET.PRIVATE_CHAT).toBe('private_chat');
    expect(MATRIX_CONSTANTS.PRESET.TRUSTED_PRIVATE_CHAT).toBe('trusted_private_chat');
  });

  it('should have valid URL format', () => {
    const urlPattern = /^https?:\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(:[0-9]+)?$/;
    expect(MATRIX_CONSTANTS.HOMESERVER_URL).toMatch(urlPattern);
  });

  it('should not have trailing slash in homeserver URL', () => {
    expect(MATRIX_CONSTANTS.HOMESERVER_URL.endsWith('/')).toBe(false);
  });
});