import { createMatrixClient, getHomeserverUrl } from "~/config/matrix";
import type { MatrixClient } from "matrix-js-sdk";

interface LoginResponse {
  success: boolean;
  error?: string;
  accessToken?: string;
  userId?: string;
}

export class MatrixService {
  private client: MatrixClient | null = null;

  constructor(accessToken?: string) {
    if (accessToken) {
      this.client = createMatrixClient(accessToken);
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const tempClient = createMatrixClient();
      const response = await tempClient.login("m.login.password", {
        user: username,
        password: password,
      });

      if (response.access_token) {
        this.client = createMatrixClient(response.access_token);
        return {
          success: true,
          accessToken: response.access_token,
          userId: response.user_id,
        };
      }

      return {
        success: false,
        error: "No access token received",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async logout(): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }
      await this.client.logout();
      this.client = null;
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }

  getHomeserverUrl(): string {
    return getHomeserverUrl();
  }

  isAuthenticated(): boolean {
    return this.client !== null;
  }
}

// Create a singleton instance for server-side usage
let matrixService: MatrixService | null = null;

export const getMatrixService = (accessToken?: string): MatrixService => {
  if (!matrixService || accessToken) {
    matrixService = new MatrixService(accessToken);
  }
  return matrixService;
};