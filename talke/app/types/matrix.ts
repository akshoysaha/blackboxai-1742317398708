import type { 
  MatrixClient, 
  ICreateClientOpts, 
  ISendEventResponse,
  IRegisterRequestParams,
  IContent,
  UploadOpts,
  IUploadResponse,
  ICreateRoomOpts,
  ILoginFlowResponse,
  IRegisterResponse,
  ILoginResponse,
  Preset,
  Visibility,
  EventType,
  MsgType
} from 'matrix-js-sdk';

export interface MatrixLoginResponse {
  userId: string;
  accessToken: string;
  deviceId: string;
  homeServer: string;
}

export interface MatrixRegisterParams {
  username: string;
  password: string;
  deviceId?: string;
  initialDeviceDisplayName?: string;
  auth?: {
    type: string;
    session?: string;
  };
}

export interface MatrixCreateRoomParams {
  name: string;
  isGroup?: boolean;
  topic?: string;
  invite?: string[];
  preset?: Preset;
  visibility?: Visibility;
}

export interface MatrixMessage {
  id: string;
  content: string;
  type: MsgType;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  timestamp: Date;
  isCurrentUser: boolean;
}

export interface MatrixRoom {
  id: string;
  name: string;
  topic?: string;
  avatarUrl?: string;
  isGroup: boolean;
  memberCount: number;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  unreadCount: number;
}

export interface MatrixFileUpload {
  file: Buffer;
  contentType: string;
  fileName: string;
}

export type {
  MatrixClient,
  ICreateClientOpts,
  ISendEventResponse,
  IRegisterRequestParams,
  IContent,
  UploadOpts,
  IUploadResponse,
  ICreateRoomOpts,
  ILoginFlowResponse,
  IRegisterResponse,
  ILoginResponse,
  Preset,
  Visibility,
  EventType,
  MsgType
};