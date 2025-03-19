import { MATRIX_CONSTANTS } from '~/config/matrix';

interface LoginResponse {
  accessToken: string;
  userId: string;
  deviceId: string;
  homeServer: string;
}

interface Room {
  id: string;
  name: string;
  topic: string;
  isGroup: boolean;
  memberCount: number;
}

interface MatrixError {
  name: string;
  message: string;
  errcode: string;
  data: any;
}

class MatrixService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = MATRIX_CONSTANTS.HOMESERVER_URL;
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/_matrix/client/v3/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'm.login.password',
        identifier: {
          type: 'm.id.user',
          user: username,
        },
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        name: 'MatrixError',
        message: data.error,
        errcode: data.errcode,
        data,
      } as MatrixError;
    }

    return {
      accessToken: data.access_token,
      userId: data.user_id,
      deviceId: data.device_id,
      homeServer: data.home_server,
    };
  }

  async getRooms(accessToken: string): Promise<Room[]> {
    // Get joined rooms
    const roomsResponse = await fetch(
      `${this.baseUrl}/_matrix/client/v3/joined_rooms`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { joined_rooms } = await roomsResponse.json();

    // Get details for each room
    const rooms = await Promise.all(
      joined_rooms.map(async (roomId: string) => {
        // Get room state
        const stateResponse = await fetch(
          `${this.baseUrl}/_matrix/client/v3/rooms/${roomId}/state`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const state = await stateResponse.json();

        // Get room members
        const membersResponse = await fetch(
          `${this.baseUrl}/_matrix/client/v3/rooms/${roomId}/members`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const { chunk: members } = await membersResponse.json();

        const joinedMembers = members.filter(
          (member: any) => member.membership === 'join'
        );

        return {
          id: roomId,
          name: state.name || 'Unnamed Room',
          topic: state.topic || '',
          isGroup: joinedMembers.length > 2,
          memberCount: joinedMembers.length,
        };
      })
    );

    return rooms;
  }
}

export const matrixService = new MatrixService();