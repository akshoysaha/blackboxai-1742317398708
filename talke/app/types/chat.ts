export interface RoomMember {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  membership: 'join' | 'invite' | 'leave' | 'ban';
  is_direct?: boolean;
}

export interface Room {
  id: string;
  name: string;
  topic?: string;
  avatar_url?: string;
  is_direct: boolean;
  members: RoomMember[];
  last_message?: Message;
  unread_count: number;
}

export interface Message {
  id: string;
  sender: string;
  sender_name?: string;
  sender_avatar?: string;
  room_id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'video' | 'audio';
  file_name?: string;
  file_size?: number;
  file_type?: string;
  thumbnail_url?: string;
  timestamp: number;
  edited?: boolean;
  reactions?: Record<string, string[]>;
}

export interface MatrixError {
  name: string;
  message: string;
  errcode: string;
  data: any;
}

export interface CreateRoomOptions {
  name?: string;
  topic?: string;
  is_direct?: boolean;
  invite?: string[];
}

export interface SendMessageOptions {
  room_id: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'video' | 'audio';
  file?: File;
}

export interface FileUploadResponse {
  content_uri: string;
  size: number;
  mimetype: string;
}