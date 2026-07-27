import { test, expect } from "../src/fixtures/api_fixture.js";
import { API_CONFIG } from "../src/config/config.js";
import { ApiHelper } from "../src/helper/api_helper.js";

test.describe('Sample API - Profile Management', () => {
  let token: string;

  // Automatically authenticate before each test
  test.beforeEach(async ({ apiClient }) => {
    const response = await apiClient.login(API_CONFIG.credentials);
    const responseBody = await ApiHelper.validateAndParse(response, 200);
    token = responseBody.token;
  });

  test('login with valid credentials', async () => {
    expect(token).toBeDefined();
    console.log("Token successfully acquired via beforeEach setup.");
  });

  test('profile management', async ({ apiClient }) => {
    // 1. Action handled by Client
    const response = await apiClient.getProfile(token);
    
    // 2. Utility handled by Helper
    const responseBody = await ApiHelper.validateAndParse(response, 200);
    
    // 3. Assertion
    expect(responseBody.profile.username).toEqual(API_CONFIG.credentials.identifier);
  });
});