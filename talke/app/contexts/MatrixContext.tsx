import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Room, Message, FileUploadResponse } from '~/types/chat';
import { useMatrixClient } from '~/hooks/useMatrixClient';

interface MatrixContextType {
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

const MatrixContext = createContext<MatrixContextType | null>(null);

interface MatrixProviderProps {
  children: ReactNode;
  accessToken?: string;
  userId?: string;
}

export function MatrixProvider({ children, accessToken, userId }: MatrixProviderProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const {
    client,
    rooms,
    isConnected,
    error,
    sendMessage,
    createRoom,
    getRoomMessages,
    uploadFile,
    leaveRoom,
    deleteRoom,
  } = useMatrixClient({
    accessToken: accessToken || '',
    userId: userId || '',
  });

  useEffect(() => {
    if (isConnected || error) {
      setIsConnecting(false);
    }
  }, [isConnected, error]);

  const value: MatrixContextType = {
    isAuthenticated: !!accessToken && isConnected,
    isConnecting,
    error,
    rooms,
    selectedRoomId,
    sendMessage,
    createRoom,
    getRoomMessages,
    uploadFile,
    leaveRoom,
    deleteRoom,
    selectRoom: setSelectedRoomId,
  };

  return (
    <MatrixContext.Provider value={value}>
      {children}
    </MatrixContext.Provider>
  );
}

export function useMatrix() {
  const context = useContext(MatrixContext);
  if (!context) {
    throw new Error('useMatrix must be used within a MatrixProvider');
  }
  return context;
}

export function useSelectedRoom() {
  const { rooms, selectedRoomId } = useMatrix();
  return rooms.find(room => room.id === selectedRoomId) || null;
}

export function useRoomMessages(roomId: string) {
  const { getRoomMessages } = useMatrix();
  return getRoomMessages(roomId);
}

export function useRoomMembers(roomId: string) {
  const { rooms } = useMatrix();
  const room = rooms.find(r => r.id === roomId);
  return room?.members || [];
}

export function useUnreadCount() {
  const { rooms } = useMatrix();
  return rooms.reduce((total, room) => total + (room.unreadCount || 0), 0);
}