import { test, expect } from "@fixtures/api_fixture";
import { API_CONFIG } from "@environment/environment.config";

test.describe.serial('User Deactivation API Tests', () => {
  let token: string;
  const targetUserId = "USR-ADM-0123";

  test('1. Login and capture token', async ({ authClient }) => {
    const response = await authClient.login(API_CONFIG.credentials);
    expect(response.status()).toBe(200);

    const body = await response.json();
    token = body.token;
  });

  test('2. Get users list', async ({ userClient }) => {
    const response = await userClient.getUsers(token);
    expect(response.status()).toBe(200);
  });

  test('3. Deactivate target user', async ({ userClient }) => {
    const response = await userClient.updateUserStatus(token, targetUserId, 'inactive');
    expect(response.status()).toBe(200);
  });

  test('4. Deactivate already deactivated user', async ({ userClient }) => {
    const response = await userClient.updateUserStatus(token, targetUserId, 'inactive');
    expect([200, 400]).toContain(response.status());
  });

  test('5. Re-activate user (cleanup)', async ({ userClient }) => {
    const response = await userClient.updateUserStatus(token, targetUserId, 'active');
    expect(response.status()).toBe(200);
  });
});