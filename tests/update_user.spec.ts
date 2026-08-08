import { test, expect } from "@fixtures/api_fixture";
import { API_CONFIG } from "@environment/environment.config";
import { UPDATE_USER_DATA } from "@data/user_data";

test.describe.serial('Update User Profile API Tests', () => {
  let token: string;

  test('1. Login and capture token', async ({ authClient }) => {
    const response = await authClient.login(API_CONFIG.credentials);
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    token = body.token;
  });

  test('2. Update user profile successfully', async ({ userClient }) => {
    const userId = "USR-ADM-6257";
    const response = await userClient.updateUser(token, userId, UPDATE_USER_DATA.payload);
    expect(response.status()).toBe(200);
  });

  test('3. Fail to update non-existent user', async ({ userClient }) => {
    const response = await userClient.updateUser(token, "INVALID-ID", UPDATE_USER_DATA.payload);
    expect([400, 404]).toContain(response.status());
  });

  test('4. Fail to update without authorization token', async ({ userClient }) => {
    const response = await userClient.updateUser("", "USR-ADM-6257", UPDATE_USER_DATA.payload);
    expect(response.status()).toBe(401);
  });
});