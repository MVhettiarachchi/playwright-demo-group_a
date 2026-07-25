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
    // 1) Validate status and parse JSON
    const usersBody = await ApiHelper.validateAndParse(usersResponse, 200);

    // 2) Structural and content validations using reusable helpers
    // - ensures `users`, `stats`, and `userLevels` exist and are arrays
    // - validates keys on first element when arrays are non-empty
    ApiHelper.validateUsersResponse(usersBody);
  });
});
