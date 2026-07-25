import { type APIRequestContext } from "@playwright/test";

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

  async createUser(token: string, userData: object) {
    return await this.requestContext.post('admin/users', { 
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: userData 
    });
  }
}