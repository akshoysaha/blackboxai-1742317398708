import { MATRIX_CONSTANTS } from '~/config/matrix';
import type { 
  Room,
  Message,
  RoomEvent,
  RoomState,
  RoomMember,
  MatrixError 
} from '~/types/chat';

export function formatRoomEvent(event: RoomEvent): Message | null {
  if (event.type !== MATRIX_CONSTANTS.ROOM_EVENT.MESSAGE) {
    return null;
  }

  return {
    id: event.event_id,
    content: event.content.body || '',
    sender: {
      id: event.sender,
      name: event.sender.split(':')[0].slice(1), // Remove @ and server name
    },
    timestamp: event.origin_server_ts,
    isCurrentUser: false, // This will be set by the component
  };
}

export function formatRoomState(state: RoomState): Partial<Room> {
  return {
    name: state.name,
    isGroup: true, // This will be updated based on member count
    memberCount: 0, // This will be updated when loading members
  };
}

export function formatError(error: any): MatrixError {
  if (error.errcode) {
    return error as MatrixError;
  }

  return {
    name: 'MatrixError',
    message: error.message || 'An unknown error occurred',
    errcode: MATRIX_CONSTANTS.ERROR_CODES.UNKNOWN,
  };
}

export function isDirectMessage(members: RoomMember[]): boolean {
  const joinedMembers = members.filter(
    (member) => member.membership === MATRIX_CONSTANTS.MEMBERSHIP.JOIN
  );
  return joinedMembers.length === 2;
}

export function getRoomDisplayName(room: Room, userId: string): string {
  if (room.name) {
    return room.name;
  }

  // For direct messages, show the other user's name
  if (!room.isGroup) {
    return room.members?.find((member) => member.user_id !== userId)?.display_name || 'Unknown User';
  }

  // For group chats without a name, list the first few members
  const memberNames = room.members
    ?.filter((member) => member.user_id !== userId)
    .map((member) => member.display_name || member.user_id.split(':')[0].slice(1))
    .slice(0, 3);

  if (!memberNames?.length) {
    return 'Empty Room';
  }

  if (memberNames.length === 1) {
    return memberNames[0];
  }

  if (memberNames.length === 2) {
    return `${memberNames[0]} and ${memberNames[1]}`;
  }

  return `${memberNames[0]}, ${memberNames[1]} and others`;
}

export function getAvatarInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function getAvatarColor(id: string): string {
  const colors = [
    '#2196f3', // blue
    '#f50057', // pink
    '#00bcd4', // cyan
    '#ff9800', // orange
    '#4caf50', // green
    '#9c27b0', // purple
    '#ff5722', // deep orange
    '#3f51b5', // indigo
    '#009688', // teal
    '#e91e63', // pink
  ];

  // Simple hash function
  const hash = id.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (diffDays === 1) {
    return 'Yesterday';
  }

  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  }

  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export function parseMatrixUri(uri: string): {
  roomId?: string;
  userId?: string;
  eventId?: string;
} {
  try {
    const url = new URL(uri);
    const [type, ...parts] = url.pathname.split('/').filter(Boolean);

    switch (type) {
      case 'room':
        return { roomId: parts[0], eventId: parts[1] };
      case 'user':
        return { userId: parts[0] };
      default:
        return {};
    }
  } catch {
    return {};
  }
}