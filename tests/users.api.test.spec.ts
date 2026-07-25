import { test, expect } from "../src/fixtures/api_fixture.js";
import { API_CONFIG } from "../src/config/config.js";
import { ApiHelper } from "../src/helper/api_helper.js";

test.describe('Users API - List Users', () => {
  test('list users with admin token', async ({ apiClient }) => {
    // Login first to obtain token
    const loginResponse = await apiClient.login(API_CONFIG.credentials);
    const loginBody = await ApiHelper.validateAndParse(loginResponse, 200);

    const token = loginBody.token;
    expect(token).toBeDefined();

    // Call users endpoint
    const usersResponse = await apiClient.getUsers(token);
    const usersBody = await ApiHelper.validateAndParse(usersResponse, 200);

    // Basic assertions about returned structure
    expect(Array.isArray(usersBody.users) || Array.isArray(usersBody)).toBeTruthy();
  });
});
