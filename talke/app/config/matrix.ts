export const MATRIX_CONSTANTS = {
  HOMESERVER_URL: process.env.VITE_MATRIX_SERVER_URL || 'http://localhost:8008',
  
  MESSAGE_TYPE: {
    TEXT: 'm.text',
    IMAGE: 'm.image',
    FILE: 'm.file',
    VIDEO: 'm.video',
    AUDIO: 'm.audio',
    LOCATION: 'm.location',
    NOTICE: 'm.notice',
    EMOTE: 'm.emote',
  },

  ERROR_CODES: {
    UNKNOWN_TOKEN: 'M_UNKNOWN_TOKEN',
    MISSING_TOKEN: 'M_MISSING_TOKEN',
    FORBIDDEN: 'M_FORBIDDEN',
    UNKNOWN: 'M_UNKNOWN',
    NOT_FOUND: 'M_NOT_FOUND',
    LIMIT_EXCEEDED: 'M_LIMIT_EXCEEDED',
    USER_IN_USE: 'M_USER_IN_USE',
    INVALID_USERNAME: 'M_INVALID_USERNAME',
    ROOM_IN_USE: 'M_ROOM_IN_USE',
    BAD_JSON: 'M_BAD_JSON',
    NOT_JSON: 'M_NOT_JSON',
    MISSING_PARAM: 'M_MISSING_PARAM',
    INVALID_PARAM: 'M_INVALID_PARAM',
    TOO_LARGE: 'M_TOO_LARGE',
    EXCLUSIVE: 'M_EXCLUSIVE',
  },

  PRESET: {
    PRIVATE_CHAT: 'private_chat',
    PUBLIC_CHAT: 'public_chat',
    TRUSTED_PRIVATE_CHAT: 'trusted_private_chat',
  },

  ROOM_VISIBILITY: {
    PUBLIC: 'public',
    PRIVATE: 'private',
  },

  MEMBERSHIP: {
    JOIN: 'join',
    LEAVE: 'leave',
    INVITE: 'invite',
    BAN: 'ban',
    KNOCK: 'knock',
  },

  PRESENCE: {
    ONLINE: 'online',
    OFFLINE: 'offline',
    UNAVAILABLE: 'unavailable',
  },

  RECEIPT_TYPE: {
    READ: 'm.read',
    FULLY_READ: 'm.fully_read',
  },

  POWER_LEVEL: {
    ADMIN: 100,
    MODERATOR: 50,
    USER: 0,
    MUTED: -1,
  },
} as const;