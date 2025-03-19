import type { Room, Message, FileUploadResponse } from './chat';

export interface MatrixContextState {
  isAuthenticated: boolean;
  isConnecting: boolean;
  error: Error | null;
  rooms: Room[];
  selectedRoomId: string | null;
  sendMessage: (roomId: string, content: string) => Promise<string>;
  createRoom: (name: string, isGroup: boolean) => Promise<string>;
  getRoomMessages: (roomId: string) => Message[];
  uploadFile: (file: File) => Promise<FileUploadResponse>;
  leaveRoom: (roomId: string) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
  selectRoom: (roomId: string) => void;
}

export interface MatrixProviderProps {
  children: React.ReactNode;
  accessToken?: string;
  userId?: string;
}