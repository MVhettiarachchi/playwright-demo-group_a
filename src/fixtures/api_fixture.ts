import { test as base } from "@playwright/test";
import { ApiClient } from "../client/api_client.js";
import { API_CONFIG } from "../config/config.js";

// Declare types for your custom fixtures
type MyFixtures = {
  apiClient: ApiClient;
};

// Extend base test to inject your customized API Client automatically
export const test = base.extend<MyFixtures>({
  apiClient: async ({ playwright }, use) => {
    // Keeps your exact lecturer context pattern isolated here!
    const requestContext = await playwright.request.newContext({
      baseURL: API_CONFIG.baseURL
    });
    
    const client = new ApiClient(requestContext);
    
    // Pass the initialized client instance to the tests
    await use(client);
  }
});

export { expect } from "@playwright/test";