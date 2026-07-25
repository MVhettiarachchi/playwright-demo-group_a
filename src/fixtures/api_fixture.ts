import { test as base } from "@playwright/test";
import { ApiClient } from "../client/api_client.js";

// Declare types for your custom fixtures
type MyFixtures = {
  apiClient: ApiClient;
};

// Extend base test to inject your customized API Client automatically
export const test = base.extend<MyFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    
    // Pass the initialized client instance to the tests
    await use(client);
  }
});

export { expect } from "@playwright/test";