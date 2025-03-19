/// <reference types="../../test/types/test.d.ts" />

import { matrixService } from './matrix.server';
import { MATRIX_CONSTANTS } from '~/config/matrix';

describe('MatrixService', () => {
  const mockAccessToken = 'mock-access-token';
  const mockUserId = '@user:matrix.org';
  const mockDeviceId = 'mock-device-id';

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock fetch globally
    global.fetch = vi.fn();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const username = 'testuser';
      const password = 'testpass';
      const mockResponse = {
        access_token: mockAccessToken,
        user_id: mockUserId,
        device_id: mockDeviceId,
        home_server: 'matrix.org',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await matrixService.login(username, password);

      expect(global.fetch).toHaveBeenCalledWith(
        `${MATRIX_CONSTANTS.HOMESERVER_URL}/_matrix/client/v3/login`,
        {
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
        }
      );

      expect(result).toEqual({
        accessToken: mockAccessToken,
        userId: mockUserId,
        deviceId: mockDeviceId,
        homeServer: 'matrix.org',
      });
    });

    it('should throw error on login failure', async () => {
      const username = 'testuser';
      const password = 'wrongpass';
      const mockError = {
        errcode: 'M_FORBIDDEN',
        error: 'Invalid password',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(mockError),
      });

      await expect(matrixService.login(username, password)).rejects.toEqual({
        name: 'MatrixError',
        message: 'Invalid password',
        errcode: 'M_FORBIDDEN',
        data: mockError,
      });
    });
  });

  describe('getRooms', () => {
    it('should fetch rooms successfully', async () => {
      const mockRooms = {
        joined_rooms: ['!room1:matrix.org', '!room2:matrix.org'],
      };

      const mockRoomState1 = {
        name: 'Room 1',
        topic: 'Test Room 1',
      };

      const mockRoomState2 = {
        name: 'Room 2',
        topic: 'Test Room 2',
      };

      const mockMembers1 = {
        chunk: [
          { user_id: '@user1:matrix.org', membership: 'join' },
          { user_id: '@user2:matrix.org', membership: 'join' },
        ],
      };

      const mockMembers2 = {
        chunk: [
          { user_id: '@user1:matrix.org', membership: 'join' },
          { user_id: '@user3:matrix.org', membership: 'join' },
          { user_id: '@user4:matrix.org', membership: 'join' },
        ],
      };

      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockRooms),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockRoomState1),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockMembers1),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockRoomState2),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockMembers2),
        });

      const rooms = await matrixService.getRooms(mockAccessToken);

      expect(rooms).toHaveLength(2);
      expect(rooms[0]).toMatchObject({
        id: '!room1:matrix.org',
        name: 'Room 1',
        topic: 'Test Room 1',
        isGroup: false,
        memberCount: 2,
      });
      expect(rooms[1]).toMatchObject({
        id: '!room2:matrix.org',
        name: 'Room 2',
        topic: 'Test Room 2',
        isGroup: true,
        memberCount: 3,
      });
    });
  });
});