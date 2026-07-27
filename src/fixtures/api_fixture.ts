import { test as base } from "@playwright/test";
import { ApiClient } from "../client/api_client.js";

// Define fixtures type
type MyFixtures = {
  apiClient: ApiClient;
};

// Extend base test with just the apiClient
export const test = base.extend<MyFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);
  },
});

export { expect } from "@playwright/test";