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
//list users - the method added to call the endpoint from your curl.
  async getUsers(token: string) {
    return await this.requestContext.get('admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}