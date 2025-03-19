import { useState, useEffect, useCallback } from 'react';
import type { Room, Message, FileUploadResponse } from '~/types/chat';
import { matrixService } from '~/services/matrix.server';

interface MatrixClientConfig {
  accessToken: string;
  userId: string;
}

interface MatrixClientState {
  client: typeof matrixService | null;
  rooms: Room[];
  isConnected: boolean;
  error: Error | null;
}

interface UseMatrixClientReturn extends MatrixClientState {
  sendMessage: (roomId: string, content: string) => Promise<string>;
  createRoom: (name: string, isGroup: boolean) => Promise<string>;
  getRoomMessages: (roomId: string) => Message[];
  uploadFile: (file: File) => Promise<FileUploadResponse>;
  leaveRoom: (roomId: string) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
}

export function useMatrixClient({
  accessToken,
  userId,
}: MatrixClientConfig): UseMatrixClientReturn {
  const [state, setState] = useState<MatrixClientState>({
    client: null,
    rooms: [],
    isConnected: false,
    error: null,
  });

  // Initialize client and fetch rooms
  useEffect(() => {
    const initClient = async () => {
      try {
        const rooms = await matrixService.getRooms(accessToken);
        setState({
          client: matrixService,
          rooms,
          isConnected: true,
          error: null,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error as Error,
          isConnected: false,
        }));
      }
    };

    initClient();
  }, [accessToken]);

  // Send message
  const sendMessage = useCallback(
    async (roomId: string, content: string) => {
      if (!state.client) throw new Error('Client not initialized');
      const messageId = await state.client.sendMessage(accessToken, {
        roomId,
        content,
      });
      return messageId;
    },
    [state.client, accessToken]
  );

  // Create room
  const createRoom = useCallback(
    async (name: string, isGroup: boolean) => {
      if (!state.client) throw new Error('Client not initialized');
      const roomId = await state.client.createRoom(accessToken, {
        name,
        isGroup,
      });

      // Update rooms list
      const rooms = await state.client.getRooms(accessToken);
      setState((prev) => ({ ...prev, rooms }));

      return roomId;
    },
    [state.client, accessToken]
  );

  // Get room messages (this would need to be implemented with proper sync/pagination)
  const getRoomMessages = useCallback(
    (roomId: string) => {
      // This is a placeholder. In a real implementation, you'd want to:
      // 1. Maintain a message store
      // 2. Implement proper pagination
      // 3. Handle message updates/deletions
      // 4. Use Matrix sync to get real-time updates
      return [];
    },
    []
  );

  // Upload file
  const uploadFile = useCallback(
    async (file: File) => {
      if (!state.client) throw new Error('Client not initialized');
      return state.client.uploadFile(accessToken, file);
    },
    [state.client, accessToken]
  );

  // Leave room
  const leaveRoom = useCallback(
    async (roomId: string) => {
      if (!state.client) throw new Error('Client not initialized');
      await state.client.leaveRoom(accessToken, roomId);

      // Update rooms list
      setState((prev) => ({
        ...prev,
        rooms: prev.rooms.filter((room) => room.id !== roomId),
      }));
    },
    [state.client, accessToken]
  );

  // Delete room
  const deleteRoom = useCallback(
    async (roomId: string) => {
      if (!state.client) throw new Error('Client not initialized');
      await state.client.deleteRoom(accessToken, roomId);

      // Update rooms list
      setState((prev) => ({
        ...prev,
        rooms: prev.rooms.filter((room) => room.id !== roomId),
      }));
    },
    [state.client, accessToken]
  );

  return {
    ...state,
    sendMessage,
    createRoom,
    getRoomMessages,
    uploadFile,
    leaveRoom,
    deleteRoom,
  };
}