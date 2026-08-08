import { ApiClient } from "@client/api_client.js";
import { API_CONFIG } from "@environment/environment.config.js";

export class UserClient extends ApiClient {
  async activeUser(userId: string, token: string) {
    return await this.patch(`admin/users/${userId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: API_CONFIG.activeUserPayload
    });
  }

  async createUser(token: string, userData: object) {
    return await this.post('admin/users', { 
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: userData 
    });
  }

  async getUsers(token: string) {
    return await this.get('admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async updateUserStatus(token: string, userId: string, status: 'active' | 'inactive') {
    return await this.patch(`admin/users/${userId}/status`, { 
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: { status }
    });
  }

  async updateUser(token: string, userId: string, userData: Record<string, any>) {
    return await this.put(`admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: userData
    });
  }
}