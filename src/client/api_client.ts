import { type APIRequestContext } from "@playwright/test";

export class ApiClient {
  protected requestContext: APIRequestContext;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
  }

  // 1. GET
  async get(endpoint: string, options?: any) {
    return await this.requestContext.get(endpoint, options);
  }

  // 2. POST
  async post(endpoint: string, options?: any) {
    return await this.requestContext.post(endpoint, options);
  }

  // 3. PUT
  async put(endpoint: string, options?: any) {
    return await this.requestContext.put(endpoint, options);
  }

  // 4. PATCH
  async patch(endpoint: string, options?: any) {
    return await this.requestContext.patch(endpoint, options);
  }

  // 5. DELETE
  async delete(endpoint: string, options?: any) {
    return await this.requestContext.delete(endpoint, options);
  }
}