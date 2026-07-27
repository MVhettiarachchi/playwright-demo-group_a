import { test, expect } from "../src/fixtures/api_fixture.js";
import { API_CONFIG } from "../src/config/config.js";
import { ApiHelper } from "../src/helper/api_helper.js";
import { UPDATE_USER_DATA } from "../src/data/user_data.js";

test.describe('Update User Profile API Tests', () => {
  let token: string;

  test.beforeEach(async ({ apiClient }) => {
    const loginRes = await apiClient.login(API_CONFIG.credentials);
    const loginBody = await ApiHelper.validateAndParse(loginRes, 200);
    token = loginBody.token;
  });

  test('Should dynamically pick the 1st user from list, edit, and verify updates', async ({ apiClient }) => {
    const initialListRes = await apiClient.getUsers(token);
    const initialListBody = await ApiHelper.validateAndParse(initialListRes, 200);
    const users = initialListBody.users ?? initialListBody.data ?? initialListBody;

    expect(users.length).toBeGreaterThan(0);

    const firstUser = users[0];
    const targetUserId = firstUser.user_id ?? firstUser.id ?? firstUser.sub;
    const currentDisplayName = firstUser.display_name ?? firstUser.displayName ?? 'User';

    const updatePayload = {
      ...UPDATE_USER_DATA.payload,
      username: `${firstUser.username}_edited`,
      displayName: `Edited ${currentDisplayName}`
    };

    const updateRes = await apiClient.updateUser(token, targetUserId, updatePayload);
    await ApiHelper.validateAndParse(updateRes, 200);

    const updatedListRes = await apiClient.getUsers(token);
    const updatedListBody = await ApiHelper.validateAndParse(updatedListRes, 200);
    const refreshedUsers = updatedListBody.users ?? updatedListBody.data ?? updatedListBody;

    const updatedUser = refreshedUsers.find((u: any) => (u.user_id ?? u.id ?? u.sub) === targetUserId);

    expect(updatedUser).toBeDefined();
    expect(updatedUser.username).toBe(updatePayload.username);
    
    // Check fallback for backend property casing (display_name OR displayName)
    const actualDisplayName = updatedUser.display_name ?? updatedUser.displayName;
    expect(actualDisplayName).toBe(updatePayload.displayName);
  });

  test('Should fail when attempting to update a non-existent user ID', async ({ apiClient }) => {
    const fakeUserId = "INVALID-ID-999999";
    const updateRes = await apiClient.updateUser(token, fakeUserId, UPDATE_USER_DATA.payload);
    
    expect([400, 404]).toContain(updateRes.status());
  });

  test('Should fail to update user without authentication token', async ({ apiClient }) => {
    const initialListRes = await apiClient.getUsers(token);
    const initialListBody = await ApiHelper.validateAndParse(initialListRes, 200);
    const users = initialListBody.users ?? initialListBody.data ?? initialListBody;

    const targetUserId = users[0].user_id ?? users[0].id ?? users[0].sub;
    const invalidToken = "";

    const updateRes = await apiClient.updateUser(invalidToken, targetUserId, UPDATE_USER_DATA.payload);
    
    expect(updateRes.status()).toBe(401);
  });

  test('Should successfully handle repeated update requests with the same data', async ({ apiClient }) => {
    const initialListRes = await apiClient.getUsers(token);
    const initialListBody = await ApiHelper.validateAndParse(initialListRes, 200);
    const users = initialListBody.users ?? initialListBody.data ?? initialListBody;

    const targetUserId = users[0].user_id ?? users[0].id ?? users[0].sub;

    const updateRes1 = await apiClient.updateUser(token, targetUserId, UPDATE_USER_DATA.payload);
    await ApiHelper.validateAndParse(updateRes1, 200);

    const updateRes2 = await apiClient.updateUser(token, targetUserId, UPDATE_USER_DATA.payload);
    await ApiHelper.validateAndParse(updateRes2, 200);
  });
});