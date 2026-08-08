import { test, expect } from "@fixtures/api_fixture";
import { API_CONFIG } from "@environment/environment.config";

test.describe('Users API - List Users', () => {
  test('list users with admin token', async ({ authClient, userClient }) => {
    const loginResponse = await authClient.login(API_CONFIG.credentials);
    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    const token = loginBody.token;
    expect(token).toBeDefined();

    const usersResponse = await userClient.getUsers(token);
    expect(usersResponse.status()).toBe(200);
  });
});