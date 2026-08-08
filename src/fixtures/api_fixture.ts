import { test as base } from '@playwright/test';
import { ApiClient } from '@client/api_client';
import { AuthClient } from '@client/auth_client';
import { UserClient } from '@client/user_client';
import { ExamClient } from '@client/exam_client';

// 1. Define custom fixture types for Playwright
type ApiFixtures = {
  apiClient: ApiClient;
  authClient: AuthClient;
  userClient: UserClient;
  examClient: ExamClient;
};

// 2. Extend base test with all your API client instances
export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },
  userClient: async ({ request }, use) => {
    await use(new UserClient(request));
  },
  examClient: async ({ request }, use) => {
    await use(new ExamClient(request));
  },
});

export { expect } from '@playwright/test';