import { type APIRequestContext } from "@playwright/test";
import { API_CONFIG } from "../config/config.js";

export class ApiClient {
  protected requestContext: APIRequestContext;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
  }

  async login(credentials: object) {
    return await this.requestContext.post('auth/login', { 
      data: credentials 
    });
  }

  async getProfile(token: string) {
    return await this.requestContext.get('admin/profile', { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Active User
  async activeUser(userId: string, token: string) {

    return await this.requestContext.patch(
      `admin/users/${userId}/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },

        data: API_CONFIG.activeUserPayload
      }
    );
  }

  async createUser(token: string, userData: object) {
    return await this.requestContext.post('admin/users', { 
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: userData 
    });
  }

  async getUsers(token: string) {
    return await this.requestContext.get('admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async updateUserStatus(token: string, userId: string, status: 'active' | 'inactive') {
    return await this.requestContext.patch(`admin/users/${userId}/status`, { 
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: { status }
    });
  }
}