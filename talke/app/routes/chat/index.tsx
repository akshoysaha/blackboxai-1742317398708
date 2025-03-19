import { useEffect, useState } from 'react';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { getUserFromSession } from '~/utils/session.server';
import { useMatrix, MatrixProvider } from '~/contexts/MatrixContext';
import ChatLayout from '~/components/chat/ChatLayout';
import RoomList from '~/components/chat/RoomList';
import MessageList from '~/components/chat/MessageList';
import MessageInput from '~/components/chat/MessageInput';
import RoomHeader from '~/components/chat/RoomHeader';
import CreateRoomDialog from '~/components/chat/CreateRoomDialog';
import LoadingState from '~/components/ui/LoadingState';
import ErrorState from '~/components/ui/ErrorState';
import { useNotification } from '~/hooks/useNotification';
import NotificationSnackbar from '~/components/notifications/NotificationSnackbar';
import type { Room, Message } from '~/types/chat';
import type { MatrixContextState } from '~/types/matrix-context';

interface LoaderData {
  accessToken: string;
  userId: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);
  if (!user) {
    return redirect('/login');
  }

  return json<LoaderData>({
    accessToken: user.accessToken,
    userId: user.userId,
  });
};

function ChatContent() {
  const {
    isConnecting,
    error,
    rooms,
    selectedRoomId,
    selectRoom,
    sendMessage,
    createRoom,
    uploadFile,
    leaveRoom,
    deleteRoom,
    getRoomMessages,
  } = useMatrix();

  const { notification, showSuccess, showError, hideNotification } = useNotification();
  const [createRoomOpen, setCreateRoomOpen] = useState(false);

  const selectedRoom = selectedRoomId ? rooms.find((room) => room.id === selectedRoomId) : undefined;
  const messages = selectedRoomId ? getRoomMessages(selectedRoomId) : [];

  if (isConnecting) {
    return <LoadingState message="Connecting to Matrix..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to connect to Matrix server"
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  const handleCreateRoom = async (name: string, isGroup: boolean) => {
    try {
      await createRoom(name, isGroup);
      showSuccess('Room created successfully');
      setCreateRoomOpen(false);
    } catch (error) {
      showError('Failed to create room');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedRoomId) return;
    try {
      await sendMessage(selectedRoomId, content);
    } catch (error) {
      showError('Failed to send message');
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedRoomId) return;
    try {
      const response = await uploadFile(file);
      await sendMessage(selectedRoomId, `Uploaded file: ${file.name}`);
    } catch (error) {
      showError('Failed to upload file');
    }
  };

  const handleLeaveRoom = async () => {
    if (!selectedRoomId) return;
    try {
      await leaveRoom(selectedRoomId);
      showSuccess('Left room successfully');
    } catch (error) {
      showError('Failed to leave room');
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoomId) return;
    try {
      await deleteRoom(selectedRoomId);
      showSuccess('Room deleted successfully');
    } catch (error) {
      showError('Failed to delete room');
    }
  };

  return (
    <>
      <ChatLayout>
        <RoomList
          rooms={rooms}
          selectedRoomId={selectedRoomId || undefined}
          onRoomSelect={selectRoom}
          onCreateRoom={() => setCreateRoomOpen(true)}
        />

        {selectedRoom ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <RoomHeader
              name={selectedRoom.name}
              isGroup={selectedRoom.isGroup}
              memberCount={selectedRoom.memberCount}
              avatarUrl={selectedRoom.avatarUrl}
              topic={selectedRoom.topic}
              onLeaveRoom={handleLeaveRoom}
              onDeleteRoom={handleDeleteRoom}
            />
            <MessageList messages={messages} />
            <MessageInput
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
            />
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            Select a room to start chatting
          </div>
        )}

        <CreateRoomDialog
          open={createRoomOpen}
          onClose={() => setCreateRoomOpen(false)}
          onSubmit={handleCreateRoom}
        />
      </ChatLayout>

      <NotificationSnackbar
        notification={notification}
        onClose={hideNotification}
      />
    </>
  );
}

export default function ChatPage() {
  const { accessToken, userId } = useLoaderData<LoaderData>();

  return (
    <MatrixProvider accessToken={accessToken} userId={userId}>
      <ChatContent />
    </MatrixProvider>
  );
}