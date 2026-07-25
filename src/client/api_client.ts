import { type APIRequestContext } from "@playwright/test";
import { API_CONFIG } from "../config/config.js";

export class ApiClient {
  private requestContext: APIRequestContext;

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

}