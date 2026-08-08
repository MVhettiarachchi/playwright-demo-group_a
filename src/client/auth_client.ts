import { ApiClient } from "@client/api_client.js";

export class AuthClient extends ApiClient {
  async login(credentials: object) {
    return await this.post('auth/login', { 
      data: credentials 
    });
  }

  async getProfile(token: string) {
    return await this.get('admin/profile', { 
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}